import {getPageBySlug, getAllPages, getFeaturedMediaById, getPostRevisionsById} from "@/lib/wordpress";
import { Section, Container } from "@/components/craft";
import { siteConfig } from "@/site.config";
import Image from "next/image";

import type { Metadata } from "next";
import React, {ReactElement} from "react";
import { Page as WordpressPage } from "@/lib/wordpress.d";
import {notFound} from "next/navigation";
import {draftMode} from "next/headers";

export const revalidate = 600;

export async function generateStaticParams(): Promise<{slug: string}[]> {
  const pages: WordpressPage[] = await getAllPages();

  return pages.map((page: WordpressPage): {slug: string} => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append("title", page.title.rendered);
  // Strip HTML tags for description and limit length
  const description: string = page.excerpt?.rendered
    ? page.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
    : page.content.rendered
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 200) + "...";
  ogUrl.searchParams.append("description", description);

  return {
    title: page.title.rendered,
    description: description,
    openGraph: {
      title: page.title.rendered,
      description: description,
      type: "article",
      url: `${siteConfig.site_domain}/pages/${page.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: page.title.rendered,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title.rendered,
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
  let page: WordpressPage = await getPageBySlug(slug);
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    // @ts-ignore
    page = await getPostRevisionsById(page.id);
  }

  if (!page) {
    notFound();
  }

  let media;
  if (page.featured_media) {
    media = await getFeaturedMediaById(page.featured_media)
  }

  return (
      <Section className="page-page">
        <Container>
          <div
              className="mx-90px page-header"
          >
            <h1 className="h3-headings-and-pullquotes md:h2-headings-and-intros">{page.title.rendered}</h1>
          </div>
          <div className="mx-90px grid max-md:grid-cols-4 md:grid-cols-16 md:gap-6">
            <div className="featured-image">
              {media &&
                  <Image
                      src={media.media_details.sizes.full.source_url}
                      alt={page.title.rendered}
                      height={media.media_details.sizes.full.height}
                      width={media.media_details.sizes.full.width}
                  />
              }
            </div>
            <div className="page-html" dangerouslySetInnerHTML={{'__html': page.content.rendered}}/>
          </div>
        </Container>
      </Section>
  );
}
