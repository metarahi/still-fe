import React, {ReactElement} from "react";
import {getFeaturedMediaById, getPageById, getPostById} from "@/lib/wordpress";
import Link from "next/link";
import Image from "next/image";
import {FeaturedMedia, Page, Post} from "@/lib/wordpress.d";

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

export default async function LatestNews(): Promise<ReactElement<any, any>> {
    const HOME_PAGE_ID = 34;
    const ACF_LATEST_ARTICLES_BLOCK = 'acf/latest-articles';

    const homePage: Page = await getPageById(HOME_PAGE_ID);
    const blocks: Record<string, unknown> | undefined = homePage.block_data;

    // Extract article IDs from block data
    const extractLatestArticleIds = (blocks: Record<string, unknown> | undefined): number[] => {
        const ids: number[] = [];
        if (blocks) {
            // @ts-ignore
            blocks.forEach((block: { blockName: string; attrs: { data: { latest_articles: number[] } } }): void => {
                if (block.blockName === ACF_LATEST_ARTICLES_BLOCK && block.attrs.data.latest_articles) {
                    ids.push(...block.attrs.data.latest_articles);
                }
            });
        }
        return ids;
    };

    const latestArticleIds: number[] = extractLatestArticleIds(blocks);

    // Fetch articles and their featured media
    const latestArticles = await Promise.all(
        latestArticleIds.map(async (id: number) => {
            const article: Post = await getPostById(id);
            const featuredMedia: FeaturedMedia | null = article.featured_media
                ? await getFeaturedMediaById(article.featured_media)
                : null;
            return { article, featuredMedia };
        })
    );

    // Extract intro block from article data
    const extractIntro = (block_data: Record<string, any> | undefined) => {
        if (!block_data) {
            return;
        }
        return block_data.find((block: { blockName: string }): boolean => block.blockName === "core/heading") || null;
    };

    // Render
    return (
        <div className="latest-news-block mx-90px">
            <h2 className="small-caps-menu-button-lists">News & Articles</h2>
            <div className="inner grid grid-cols-16 gap-6 mb-24">
                {latestArticles.map(({ article, featuredMedia }, index: number): ReactElement<any, any> => {
                    const intro = extractIntro(article.block_data);
                    return (
                        <article key={index} className={`article-${index + 1}`}>
                            <Link href={`/articles/${article.slug}`}>
                                {featuredMedia && <Image
                                    src={featuredMedia.media_details.sizes.full.source_url}
                                    alt={article.title.rendered}
                                    height={featuredMedia?.media_details.sizes.full.height}
                                    width={featuredMedia?.media_details.sizes.full.width}
                                />}
                            </Link>
                            <h3 className="h3-headings-and-pullquotes">
                                <Link href={`/articles/${article.slug}`}>
                                    {article.title.rendered} <span className="arrow">→</span>
                                </Link>
                            </h3>
                            <p
                                className="excerpt"
                                dangerouslySetInnerHTML={{
                                    __html: createExcerpt(
                                        intro?.rendered || article.excerpt.rendered,
                                        220
                                    ),
                                }}
                            />
                            <Link href={`/articles/${article.slug}`} className="border-b border-black">
                                Read more
                            </Link>
                        </article>
                    );
                })}
                <Link href="/articles" className="button border p-3 border-black">
                    See all articles
                </Link>
            </div>
        </div>
    );
}
