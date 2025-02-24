import {
    getFeaturedMediaById,
    getTeamMemberBySlug,
    getAllTeamMembers,
} from "@/lib/wordpress";

import { Section, Container } from "@/components/craft";
import { siteConfig } from "@/site.config";
import type { Metadata } from "next";
import React from "react";
import ProjectGallery from "@/components/projects/project-gallery";
import LatestNews from "@/components/latest-news";

export async function generateStaticParams() {
    const projects = await getAllTeamMembers();

    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getTeamMemberBySlug(slug);

    if (!post) {
        return {};
    }

    const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrl.searchParams.append("title", post.title.rendered);
    // Strip HTML tags for description
    const description = post.excerpt?.rendered.replace(/<[^>]*>/g, "").trim();
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
    const post = await getTeamMemberBySlug(slug);
    const featuredMedia = post.acf.secondary_image
        ? await getFeaturedMediaById(post.acf.secondary_image)
        : await getFeaturedMediaById(post.featured_media);

    return (
        <Section>
            <Container>
                <div
                    className="mx-90px page-header"
                >
                    <h1 className="h2-headings-and-intros">
                        {post.title.rendered}
                        <span className="job-title small-caps-menu-button-lists">{post.acf.job_title}</span>
                    </h1>
                </div>

                <div className="page-html team-page-html grid grid-cols-16 gap-6 mx-90px">
                    <div className="rendered-content" dangerouslySetInnerHTML={{__html: post.content.rendered}} />
                    <a href="/our-team" className="button border p-3 border-black">Back to team</a>

                    {featuredMedia &&
                        <img
                            className="w-half"
                            src={featuredMedia.source_url}
                            alt={post.title.rendered}
                        />
                    }
                </div>

            </Container>
        </Section>
    );
}
