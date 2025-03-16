import {
    getFeaturedMediaById,
    getTeamMemberBySlug,
    getAllTeamMembers, getPostRevisionsById,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import React, {ReactElement} from "react";
import Image from "next/image";
import Link from "next/link";
import { FeaturedMedia, Post } from "@/lib/wordpress.d";
import {notFound} from "next/navigation";
import {draftMode} from "next/headers";

export async function generateStaticParams() {
    const projects: Post[] = await getAllTeamMembers();

    return projects.map((project: Post): {slug: any} => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post: Post = await getTeamMemberBySlug(slug);

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
            url: `${siteConfig.site_domain}/our-team/${post.slug}`,
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
    let post: Post = await getTeamMemberBySlug(slug);
    const { isEnabled } = await draftMode();
    if (isEnabled) {
        // @ts-ignore
        post = await getPostRevisionsById(post.id);
    }

    if (!post) {
        notFound();
    }

    const featuredMedia: FeaturedMedia = post.acf?.secondary_image
        ? await getFeaturedMediaById(Number(post.acf?.secondary_image))
        : await getFeaturedMediaById(post.featured_media);

    return (
        <Section>
            <Container>
                <div
                    className="mx-90px page-header team-member-page-header"
                >
                    <h1 className="h3-headings-and-pullquotes md:h2-headings-and-intros">
                        {post.title.rendered}
                        <span className="job-title small-caps-menu-button-lists">{post.acf?.job_title}</span>
                    </h1>
                </div>

                <div className="page-html team-page-html md:grid md:grid-cols-16 md:gap-6 mx-90px">
                    <div className="rendered-content" dangerouslySetInnerHTML={{__html: post.content.rendered}} />

                    {featuredMedia &&
                        <Image
                            className="w-half"
                            src={featuredMedia.source_url}
                            alt={post.title.rendered}
                            height={featuredMedia.media_details.height}
                            width={featuredMedia.media_details.width}
                        />
                    }

                    <Link href="/our-team" className="button border p-3 border-black">Back to team</Link>
                </div>

            </Container>
        </Section>
    );
}
