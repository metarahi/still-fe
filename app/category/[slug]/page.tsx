import {
    getAllPosts,
    getAllCategories,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";

import type { Metadata } from "next";
import LoadMore from "@/components/posts/load-more";
import { Category, Post } from "@/lib/wordpress.d";
import {ReactElement} from "react";
import ArticleCategories from "@/components/posts/article-categories";
import {notFound} from "next/navigation";

export async function generateStaticParams(): Promise<{slug: string}[]> {
    const categories: Category[] = await getAllCategories();

    return categories.map((category: Category): {slug: string} => ({
        slug: category.slug,
    }));
}

export const metadata: Metadata = {
    title: "News & Articles",
    description: "Browse all our news & articles",
};

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ slug: string }>;
}): Promise<ReactElement<any, any>> {
    const { slug } = await params;

    const categories: Category[] = await getAllCategories();

    let categoryId: number = 0;
    categories.forEach((category: Category) => {
        if (category.slug === slug) {
            categoryId = category.id;
        }
    });

    if (! categoryId) {
        notFound();
    }

    const posts: Post[] = await getAllPosts();
    const postsByCategory: Post[] = posts.filter(function(post: Post): boolean {
        return post.categories?.includes(categoryId) ?? false;
    });

    // Handle pagination
    const page: number = 1;
    const postsPerPage = 6;
    const paginatedPosts: Post[] = postsByCategory.slice(
        (page - 1) * postsPerPage,
        page * postsPerPage
    );


    return (
        <Section>
            <Container>
                <div className="mx-90px page-header">
                    <h1 className="small-caps-heading">News & Articles</h1>
                </div>
                <div className="article-grid">

                    {paginatedPosts.length > 0 ? (
                        <div className="mx-90px md:grid md:grid-cols-16 md:gap-6">
                            <ArticleCategories categories={categories} />
                            <LoadMore initialPaginatedPosts={paginatedPosts} posts={postsByCategory}/>
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
