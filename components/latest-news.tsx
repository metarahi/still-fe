import React from "react";
import {getFeaturedMediaById, getPageById, getPostById} from "@/lib/wordpress";
import Link from "next/link";
import Image from "next/image";

function createExcerpt(string, maxLength = 300) {
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

export default async function LatestNews() {
    const homePage = await getPageById(34);
    const blocks = homePage.block_data;
    let latestArticleIds: Array<number> = [];
    let latestArticles: Array<any> = [];

    blocks.forEach((block: { blockName: string; attrs: { data: { latest_articles: number[]; }; }; }) => {
        if (block.blockName === 'acf/latest-articles') {
            latestArticleIds = block.attrs.data.latest_articles;
        }
    });

    for (const id of latestArticleIds) {
        let article = await getPostById(id);
        const featuredMedia = article.featured_media
            ? await getFeaturedMediaById(article.featured_media)
            : null;
        latestArticles.push([article, featuredMedia]);
    }

    return <div className="latest-news-block mx-90px">
        <h2 className="small-caps-menu-button-lists">News & Articles</h2>
        <div className="inner grid grid-cols-16 gap-6 mb-24">
            {latestArticles && latestArticles.map((article, index) => {
                let intro;
                article[0].block_data.forEach((block: { blockName: string; }) => {
                    if (block.blockName === "core/heading") {
                        intro = block;
                    }
                });
                return <article
                    key={index}
                    className={"article-" + (index + 1)}
                >
                    <a href={`/articles/${article[0].slug}`}>
                        <Image
                            src={article[1].media_details.sizes.full.source_url}
                            alt={article[0].title.rendered}
                            height={article[1].media_details.sizes.full.height}
                            width={article[1].media_details.sizes.full.width}
                        />
                    </a>
                    <h3 className="h3-headings-and-pullquotes"><a href={`/articles/${article[0].slug}`}>{article[0].title.rendered} <span className="arrow">→</span></a></h3>
                    <p className="excerpt" dangerouslySetInnerHTML={{__html: createExcerpt(intro ? intro.rendered : article[0].excerpt.rendered, 220)}}/>
                    <a href={`/articles/${article[0].slug}`} className="border-b border-black">Read more</a>
                </article>
            })}
            <Link href="/articles" className="button border p-3 border-black">See all articles</Link>
        </div>
    </div>
}
