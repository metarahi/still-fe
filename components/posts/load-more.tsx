"use client";
import React, {ReactElement, useState} from "react";
import {PostCard} from "@/components/posts/post-card";
import { Post } from "@/lib/wordpress.d";

interface Props {
    initialPaginatedPosts: Array<Post>,
    posts: Array<Post>
}
const LoadMore: React.FC<Props> = ({initialPaginatedPosts, posts}: Props): ReactElement<any, any> => {
    const [paginatedPosts, setPaginatedPosts] = useState(initialPaginatedPosts || []);

    function handleLoadMore(): void {
        // Calculate how many more posts to load
        const currentLength: number = paginatedPosts.length;
        const nextBatch: Post[] = posts.slice(currentLength, currentLength + 6);

        // Update state with new posts
        setPaginatedPosts([...paginatedPosts, ...nextBatch]);
    }

    return (<div className="load-more-wrapper">
            {paginatedPosts && paginatedPosts.map(function (post: Post, index: number): ReactElement<any, any> {
                const columnPositions: string[] = ["grid-start-1", "grid-start-7"];
                const gridClass: string = columnPositions[index % 2];
                return <PostCard post={post} gridClass={gridClass} key={post.id} />
            })}

            {paginatedPosts.length < posts.length ? (
                <button
                    className="button border p-3 border-black"
                    onClick={(): void => handleLoadMore()}
                >Load More</button>
            ) : null}
        </div>

    )
}

export default LoadMore;
