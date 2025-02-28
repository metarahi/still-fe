import {FeaturedPost} from "@/components/posts/featured-post";
import {PostCard} from "@/components/posts/post-card";
import React, {ReactElement} from "react";
import Link from "next/link";
import { Category, Post } from "@/lib/wordpress.d";

interface Props {
    paginatedPosts: any,
    featuredPost: any,
    category: any,
    categories: any,
    posts: any,
}

const ArticleGrid: React.FC<Props> = ({paginatedPosts, featuredPost, category, categories, posts}) => {
    function handleLoadMore() {
        return paginatedPosts.push(paginatedPosts[0]);
    }

    return (<div>
            {
                paginatedPosts.length > 0 ? (
                    <div className="mx-90px grid grid-cols-16 gap-6">
                        {!category &&
                            <FeaturedPost post={featuredPost}/>
                        }

                        {paginatedPosts.map(function (post: Post, index: number): ReactElement<any, any> {
                            const columnPositions = ["grid-start-4", "grid-start-10"];
                            const gridClass = columnPositions[index % 2];
                            return <PostCard key={post.id} post={post} gridClass={gridClass}/>
                        })}

                        <div className="article-categories flex flex-col">
                            <div className="small-caps-menu-button-lists">categories:</div>
                            {categories.map((category: Category): ReactElement<any, any> => (
                                <Link key={category.id} href={`?category=${category.id.toString()}`}
                                   className="border-radius">
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>No posts found</p>
                    </div>
                )
            }

            {paginatedPosts.length < posts.length ? (
                <button onClick={() => handleLoadMore()}>Load More</button>
            ) : null}
        </div>
    )
}

export default ArticleGrid;
