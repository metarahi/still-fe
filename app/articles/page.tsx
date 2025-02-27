import {
  getAllPosts,
  getAllCategories,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";

import type { Metadata } from "next";
import {FeaturedPost} from "@/components/posts/featured-post";
import LoadMore from "@/components/posts/load-more";

export const metadata: Metadata = {
  title: "News & Articles",
  description: "Browse all our news & articles",
};

// export const dynamic = "auto";
// export const revalidate = 600;

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

  if (!category && Object.hasOwn(featuredPost, 'id')) {
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
  const paginatedPosts = posts.slice(
      (page - 1) * postsPerPage,
      page * postsPerPage
  );


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

                  <LoadMore initialPaginatedPosts={paginatedPosts} posts={posts} />

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
          </div>
        </Container>
      </Section>
  );
}
