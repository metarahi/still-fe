import {
  getAllPosts,
  getAllCategories,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";

import type { Metadata } from "next";
import {FeaturedPost} from "@/components/posts/featured-post";
import LoadMore from "@/components/posts/load-more";
import { Post } from "@/lib/wordpress.d";
import {ReactElement} from "react";
import ArticleCategories from "@/components/posts/article-categories";

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
}): Promise<ReactElement<any, any>> {
  const params: {category?: string | undefined, page?: string | undefined} = await searchParams;
  const { category, page: pageParam } = params;

  // Fetch data based on search parameters
  const [posts, categories] = await Promise.all([
    getAllPosts({ category }),
    getAllCategories(),
  ]);

  // Get featured posts
  const featuredPosts: Post[] = posts.filter(function(post: Post): boolean {
    // @ts-ignore
    return post.acf?.featured === true;
  });

  // Get one latest featured post
  const featuredPost: Post = featuredPosts[0];

  if (!category && Object.hasOwn(featuredPost, 'id')) {
    // Remove featured post from posts
    for (let i: number = 0; i < posts.length; i++) {
      const obj = posts[i];

      if (obj.id === featuredPost.id) {
        posts.splice(i, 1);
        i--;
      }
    }
  }

  // Handle pagination
  const page: number = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 6;
  const paginatedPosts: Post[] = posts.slice(
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
                <div className="mx-90px md:grid md:grid-cols-16 md:gap-6">
                  <ArticleCategories categories={categories} />

                  {!category &&
                      <FeaturedPost post={featuredPost}/>
                  }

                  <LoadMore initialPaginatedPosts={paginatedPosts} posts={posts}/>
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
