import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import React from "react";

function createExcerpt(string, maxLength = 220) {
  // Replace multiple whitespace with single space and trim
  string = string.replace(/\s+/g, ' ').trim().replace(/(<([^>]+)>)/gi, "");

  if (string.length >= maxLength) {
    string = string.slice(0, maxLength);

    const puncs = ['. ', '! ', '? ']; // Possible endings of sentence
    let maxPos = 0;

    // Find the last occurrence of each punctuation
    puncs.forEach(punc => {
      const pos = string.lastIndexOf(punc);
      if (pos !== -1 && pos > maxPos) {
        maxPos = pos;
      }
    });

    if (maxPos > 0) {
      return string.slice(0, maxPos + 1);
    }

    return string.trim() + '…'; // Using actual ellipsis character instead of HTML entity
  }

  return string;
}

export function PostCard({ post, gridClass }: { post: Post, gridClass?: string }) {

  const media = post._embedded['wp:featuredmedia'][0].media_details.sizes.full || null;
  let intro;
  post.block_data.forEach((block: { blockName: string; }) => {
    if (block.blockName === "core/heading") {
      intro = block;
    }
  });

  return (
    <Link
      href={`/articles/${post.slug}`}
      className={cn(
          gridClass
      )}
    >
      <div className="flex flex-col gap-6">
        <div className="w-full overflow-hidden relative flex items-center justify-center">
          {media?.source_url ? (
              <Image
                  className="h-full w-full object-cover"
                  src={media.source_url}
                  alt={post.title?.rendered || "Post thumbnail"}
                  width={565}
                  height={423}
              />
          ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                No image available
              </div>
          )}
        </div>
        <h3
            className="h3-headings-and-pullquotes"
        >{post.title?.rendered} <span className="arrow">→</span></h3>
        <p
            className="paragraph"
            dangerouslySetInnerHTML={{
              __html: createExcerpt(intro ? intro.rendered : post.content.rendered, 220)
            }}
        ></p>
        <p><span className="border-b border-black read-more">Read more</span></p>
      </div>
    </Link>
  );
}
