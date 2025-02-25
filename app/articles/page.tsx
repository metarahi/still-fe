import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
} from "@/lib/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { FilterPosts } from "@/components/posts/filter";
import { SearchInput } from "@/components/posts/search-input";

import type { Metadata } from "next";
import {FeaturedPost} from "@/components/posts/featured-post";
import {SelectItem} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

export const metadata: Metadata = {
  title: "News & Articles",
  description: "Browse all our news & articles",
};

export const dynamic = "auto";
export const revalidate = 600;

export default async function Page({
                                     searchParams,
                                   }: {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const { category, page: pageParam } = params;

  // Fetch data based on search parameters
  const [posts, categories] = await Promise.all([
    getAllPosts({ category }),
    getAllCategories(),
  ]);

  // Get featured posts
  const featuredPosts = posts.filter(function(post) {
    return post.acf.featured === true;
  });

  // Get one latest featured post
  const featuredPost = featuredPosts[0];

  if (typeof featuredPost === Object && Object.hasOwn(featuredPost, 'id')) {
    // Remove featured post from posts
    for (let i = 0; i < posts.length; i++) {
      const obj = posts[i];

      if (obj.id === featuredPost.id) {
        posts.splice(i, 1);
        i--;
      }
    }
  }

  // Handle pagination
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice(
      (page - 1) * postsPerPage,
      page * postsPerPage
  );

  // Create pagination URL helper
  const createPaginationUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set("page", newPage.toString());
    if (category) params.set("category", category);
    return `/articles${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
      <Section>
        <Container>
          <div className="mx-90px page-header">
            <h2 className="small-caps-heading">News & Articles</h2>
          </div>
          <div className="article-grid">

            {paginatedPosts.length > 0 ? (
                <div className="mx-90px grid grid-cols-16 gap-6">
                  {!category &&
                      <FeaturedPost post={featuredPost}/>
                  }

                  {paginatedPosts.map(function (post, index) {
                    const columnPositions = ["grid-start-4", "grid-start-10"];
                    const gridClass = columnPositions[index % 2];
                    return <PostCard key={post.id} post={post} gridClass={gridClass}/>
                  })}

                  <div className="article-categories flex flex-col">
                    <div className="small-caps-menu-button-lists">categories:</div>
                    {categories.map((category) => (
                        <a key={category.id} href={`?category=${category.id.toString()}`}
                           className="border-radius">
                          {category.name}
                        </a>
                    ))}
                  </div>
                </div>
            ) : (
                <div>
                  <p>No posts found</p>
                </div>
            )}

            {/*{displayPosts < posts.length ? (*/}
            {/*    <button onClick={handleLoadMore}>Load More</button>*/}
            {/*) : null}*/}

            {/*{totalPages > 1 && (*/}
            {/*    <Pagination>*/}
            {/*      <PaginationContent>*/}
            {/*        <PaginationItem>*/}
            {/*          <PaginationPrevious*/}
            {/*              className={*/}
            {/*                page <= 1 ? "pointer-events-none opacity-50" : ""*/}
            {/*              }*/}
            {/*              href={createPaginationUrl(page - 1)}*/}
            {/*          />*/}
            {/*        </PaginationItem>*/}
            {/*        <PaginationItem>*/}
            {/*          <PaginationLink href={createPaginationUrl(page)}>*/}
            {/*            {page}*/}
            {/*          </PaginationLink>*/}
            {/*        </PaginationItem>*/}
            {/*        <PaginationItem>*/}
            {/*          <PaginationNext*/}
            {/*              className={*/}
            {/*                page >= totalPages ? "pointer-events-none opacity-50" : ""*/}
            {/*              }*/}
            {/*              href={createPaginationUrl(page + 1)}*/}
            {/*          />*/}
            {/*        </PaginationItem>*/}
            {/*      </PaginationContent>*/}
            {/*    </Pagination>*/}
            {/*)}*/}
          </div>
        </Container>
      </Section>
  );
}
