"use client";
import React, { useState } from 'react';
import {PostCard} from "@/components/posts/post-card";
import { Post } from "@/lib/wordpress.d";

interface Props {
    initialPaginatedPosts: Array<Post>,
    posts: Array<Post>
}
const LoadMore: React.FC<Props> = ({initialPaginatedPosts, posts}: Props) => {
    const [paginatedPosts, setPaginatedPosts] = useState(initialPaginatedPosts || []);

    function handleLoadMore() {
        // Calculate how many more posts to load
        const currentLength = paginatedPosts.length;
        const nextBatch = posts.slice(currentLength, currentLength + 6);

        // Update state with new posts
        setPaginatedPosts([...paginatedPosts, ...nextBatch]);
    }

    return (<div className="load-more-wrapper">
            {paginatedPosts && paginatedPosts.map(function (post: Post, index: number) {
                const columnPositions = ["grid-start-1", "grid-start-7"];
                const gridClass = columnPositions[index % 2];
                return <PostCard post={post} gridClass={gridClass} key={post.id} />
            })}

            {paginatedPosts.length < posts.length ? (
                <button
                    className="button border p-3 border-black"
                    onClick={() => handleLoadMore()}
                >Load More</button>
            ) : null}
        </div>

    )
}

export default LoadMore;
