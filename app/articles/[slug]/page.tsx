import {
  getPostBySlug,
  getFeaturedMediaById,
  getCategoryById,
  getAllPosts,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";

import type { Metadata } from "next";
import LatestNews from "@/components/latest-news";
import Image from "next/image";
import React, {ReactElement} from "react";
import { Category, FeaturedMedia, Post } from "@/lib/wordpress.d";

export async function generateStaticParams(): Promise<{slug: string}[]> {
  const posts: Post[] = await getAllPosts();

  return posts.map((post: Post): {slug: string} => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post: Post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", post.title.rendered);
  // Strip HTML tags for description
  const description: string = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
  ogUrl.searchParams.append("description", description);

  return {
    title: post.title.rendered,
    description: description,
    openGraph: {
      title: post.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/posts/${post.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function Page({
                                     params,
                                   }: {
  params: Promise<{ slug: string }>;
}): Promise<ReactElement<any, any>> {
  const { slug } = await params;
  const post: Post = await getPostBySlug(slug);
  const featuredMedia: FeaturedMedia | null = post.featured_media
      ? await getFeaturedMediaById(post.featured_media)
      : null;
  let categories: any[] = [];
  for (const category of post.categories) {
    categories.push(await getCategoryById(category));
  }
  const words: string | undefined = post.acf?.words;
  const images: string | undefined = post.acf?.images;
  let intro;
  post.block_data?.forEach((block: { blockName: string; }): void => {
    if (block.blockName === "core/heading") {
      // @ts-ignore
      intro = block.rendered;
    }
  });

  return (
      <Section>
        <Container>
          <div className="mx-90px md:grid md:grid-cols-16 md:gap-x-6 article">
            <h1 dangerouslySetInnerHTML={{__html: post.title.rendered}}
                className="h3-headings-and-pullquotes md:h1-article-headings"></h1>

            <p className="article-meta">
              {words && (
                  <span>Words: {words}</span>
              )}
              {words && images && (<span className="delimiter"> | </span>)}
              {images && (
                  <span>Images: {images}</span>
              )}
            </p>

            <div className="article-categories flex flex-wrap justify-center items-center gap-3 md:gap-4">
              {categories && categories.map((category: Category): ReactElement<any, any> => (
                  <Link
                      key={category.id}
                      href={`/articles/?category=${category.id}`}
                      className={cn(
                          "!no-underline"
                      )}
                  >
                    {category.name}
                  </Link>
              ))}
            </div>

            {intro && (
                <div
                    dangerouslySetInnerHTML={{__html: intro.replace(/(<([^>]+)>)/gi, "")}}
                    className="article-intro h4-article-feature-text md:h2-headings-and-intros"
                >
                </div>
            )}

            {featuredMedia?.source_url && (
                <div
                    className="article-featured-image overflow-hidden flex flex-col items-center justify-center">
                  <Image
                      className="w-full h-full object-cover"
                      src={featuredMedia.source_url}
                      alt={post.title.rendered}
                      height={featuredMedia.media_details.height}
                      width={featuredMedia.media_details.width}
                  />
                  {featuredMedia.caption && (
                      <div className="article-featured-image-caption"
                           dangerouslySetInnerHTML={{ __html: featuredMedia.caption.rendered }}
                      ></div>
                  )}
                </div>
            )}

            <div className="article-content"
                 dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            >
            </div>

          </div>

          <LatestNews />
        </Container>
      </Section>
  );
}
