"use client";
import React, { useState } from 'react';
import {PostCard} from "@/components/posts/post-card";

interface Props {
    initialPaginatedPosts: Array<object>,
    posts: Array<object>
}
const LoadMore: React.FC<Props> = ({initialPaginatedPosts, posts}) => {
    const [paginatedPosts, setPaginatedPosts] = useState(initialPaginatedPosts || []);

    function handleLoadMore() {
        // Calculate how many more posts to load
        const currentLength = paginatedPosts.length;
        const nextBatch = posts.slice(currentLength, currentLength + 6);

        // Update state with new posts
        setPaginatedPosts([...paginatedPosts, ...nextBatch]);
    }

    return (<div className="load-more-wrapper">
            {paginatedPosts && paginatedPosts.map(function (post, index) {
                const columnPositions = ["grid-start-1", "grid-start-7"];
                const gridClass = columnPositions[index % 2];
                return <PostCard key={post.id} post={post} gridClass={gridClass}/>
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
