import {
    getFeaturedMediaById,
    getProjectBySlug,
    getAllProjects,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import React, {ReactElement} from "react";
import ProjectGallery from "@/components/projects/project-gallery";
import LatestNews from "@/components/latest-news";
import Image from "next/image";
import Link from "next/link";
import {FeaturedMedia, Post} from "@/lib/wordpress.d";

export async function generateStaticParams(): Promise<{slug: string}[]> {
    const projects: Post[] = await getAllProjects();

    return projects.map((project: Post): {slug: string} => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post: Post = await getProjectBySlug(slug);

    if (!post) {
        return {};
    }

    const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrl.searchParams.append("title", post.title.rendered);
    // Strip HTML tags for description
    const description: string = post.excerpt?.rendered.replace(/<[^>]*>/g, "").trim();
    ogUrl.searchParams.append("description", description);

    return {
        title: post.title.rendered,
        description: description,
        openGraph: {
            title: post.title.rendered,
            description: description,
            type: "article",
            url: `${siteConfig.site_domain}/project/${post.slug}`,
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

function getCompanyNumber(post: Post): string {
    return post.block_data?.[0]?.attrs?.data?.number || "";
}

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ slug: string }>;
}): Promise<ReactElement<any, any>> {
    const { slug } = await params;
    const post: Post = await getProjectBySlug(slug);
    const featuredMedia: FeaturedMedia | null = post.featured_media
        ? await getFeaturedMediaById(post.featured_media)
        : null;
    const companyNumber: string = getCompanyNumber(post);

    return (
        <Section>
            <Container>
                <div
                    className="mx-90px page-header"
                >
                    <h1 className="small-caps-heading">{post.title.rendered}<sup className="numbers-company-page">{companyNumber}</sup>
                    </h1>
                </div>

                <div className="page-html project-page-html md:grid md:grid-cols-16 md:gap-6 mx-90px">
                    <div className="rendered-content" dangerouslySetInnerHTML={{__html: post.content.rendered}} />
                    {featuredMedia &&
                        <Image
                            className="w-full"
                            src={featuredMedia.source_url}
                            alt={post.title.rendered}
                            height={featuredMedia.media_details.height}
                            width={featuredMedia.media_details.width}
                        />
                    }

                    <ProjectGallery content={post} />

                    <Link href="/still-100" className="button border p-3 border-black">Back to STILL 100</Link>
                </div>

                <LatestNews />

            </Container>
        </Section>
    );
}
