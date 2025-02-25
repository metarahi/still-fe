"use client";
import React from "react";
import {PostCard} from "@/components/posts/post-card";

interface Props {
    paginatedPosts: Array<object>,
    posts: Array<object>
}
const LoadMore: React.FC<Props> = ({paginatedPosts, posts}) => {

    function handleLoadMore() {
        console.log(paginatedPosts);
        console.log(posts);
      // return paginatedPosts.push(paginatedPosts[0]);
        paginatedPosts = posts;
        return paginatedPosts;
    }

    return (<div className="load-more-wrapper">
            {/*{paginatedPosts.map(function (post, index) {*/}
            {/*    const columnPositions = ["grid-start-4", "grid-start-10"];*/}
            {/*    const gridClass = columnPositions[index % 2];*/}
            {/*    return <PostCard key={post.id} post={post} gridClass={gridClass}/>*/}
            {/*})}*/}

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
