import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPosts,
} from "@/lib/wordpress";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Balancer from "react-wrap-balancer";

import type { Metadata } from "next";
import LatestNews from "@/components/latest-news";
import Image from "next/image";
import React from "react";

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
                                         params,
                                       }: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", post.title.rendered);
  // Strip HTML tags for description
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
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
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const featuredMedia = post.featured_media
      ? await getFeaturedMediaById(post.featured_media)
      : null;
  let categories = [];
  for (const category of post.categories) {
    categories.push(await getCategoryById(category));
  }
  const words = post.acf.words;
  const images = post.acf.images;
  let intro;
  post.block_data.forEach((block: { blockName: string; }) => {
    if (block.blockName === "core/heading") {
      intro = block;
    }
  });

  return (
      <Section>
        <Container>
          <div className="mx-90px grid grid-cols-16 gap-6 article">
            <h1 dangerouslySetInnerHTML={{__html: post.title.rendered}}
                className="h1-article-headings"></h1>

            <p className="article-meta">
              {words && (
                  <span>Words: {words}</span>
              )}
              {words && images && (<span> | </span>)}
              {images && (
                  <span>Images: {images}</span>
              )}
            </p>

            <div className="article-categories flex justify-center items-center gap-4">
              {categories && categories.map((category) => (
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
                    dangerouslySetInnerHTML={{__html: intro.rendered}}
                    className="article-intro h2-headings-and-intros"
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
