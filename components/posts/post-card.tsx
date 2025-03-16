import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";
import React, {ReactElement} from "react";

type Intro = {
  blockName: string;
  rendered?: string;
};

function createExcerpt(string: string, maxLength = 600): string {
  // Replace multiple whitespace with single space and trim
  string = string.replace(/\s+/g, ' ').trim().replace(/(<([^>]+)>)/gi, "");

  if (string.length >= maxLength) {
    string = string.slice(0, maxLength);

    const punctuations: string[] = ['. ', '! ', '? '];
    let maxPos: number = 0;

    // Find the last occurrence of each punctuation
    punctuations.forEach(function (punctuation: string): void {
      const pos: number = string.lastIndexOf(punctuation);
      if (pos !== -1 && pos > maxPos) {
        maxPos = pos;
      }
    });

    if (maxPos > 0) {
      return string.slice(0, maxPos + 1);
    }

    return string.trim() + '…';
  }

  return string;
}

export function PostCard({ post, gridClass }: { post: Post, gridClass?: string }): ReactElement<any, any> {

  const media: any | undefined = post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full;
  let renderedContent: string = post.content.rendered;
  post.block_data?.forEach((block: Intro): void => {
    if (block.blockName === "core/heading") {
      renderedContent = block.rendered || "";
    }
  });

  return (
    <Link
      href={`/articles/${post.slug}`}
      className={cn(
          "post-card",
          gridClass
      )}
      data-aos="fade-up"
    >
      <div className="md:flex md:flex-col md:gap-x-6">
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
              __html: createExcerpt(renderedContent, 220)
            }}
        ></p>
        <p className="read-more-wrapper"><span className="border-b border-black read-more">Read more</span></p>
      </div>
    </Link>
  );
}
