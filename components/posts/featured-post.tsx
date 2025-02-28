import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

import React from "react";

function createExcerpt(string, maxLength = 600) {
    // Replace multiple whitespace with single space and trim
    string = string.replace(/\s+/g, ' ').trim().replace(/(<([^>]+)>)/gi, "");

    if (string.length >= maxLength) {
        string = string.slice(0, maxLength);

        const puncs = ['. ', '! ', '? '];
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

        return string.trim() + '…';
    }

    return string;
}

export async function FeaturedPost({ post }: { post: Post }) {
    const media = post._embedded['wp:featuredmedia'][0].media_details.sizes.full || null;
    const words = post.acf.words;
    const images = post.acf.images;
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
                "featured-article"
            )}
        >
            <div className="w-full overflow-hidden relative flex items-center justify-center">
                {media?.source_url ? (
                    <Image
                        className="h-full w-full object-cover"
                        src={media.source_url}
                        alt={post.title?.rendered || "Post thumbnail"}
                        height={media.height}
                        width={media.width}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                        No image available
                    </div>
                )}
            </div>
            <div>
                <h3
                    className="h3-headings-and-pullquotes"
                >{post.title?.rendered} <span className="arrow">→</span></h3>
                {words && (
                    <p>Words: {words}</p>
                )}
                {images && (
                    <p>Images: {images}</p>
                )}
                <p
                    className="paragraph"
                    dangerouslySetInnerHTML={{
                        __html: createExcerpt(intro ? intro.rendered : post.content.rendered, 600)
                    }}
                ></p>
                <p><span className="border-b border-black read-more">Read more</span></p>
            </div>
        </Link>
    );
}
