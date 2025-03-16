import { Container, Section } from "@/components/craft";
import {getAllTeamMembers, getFeaturedMediaById, getPageById, getPostRevisionsById} from "@/lib/wordpress";
import type { Metadata } from "next";
import React, { ReactElement } from "react";
import TeamWrapper from "@/components/team/team-wrapper";
import { Page as WordpressPage, Post } from "@/lib/wordpress.d";
import {draftMode} from "next/headers";

export const metadata: Metadata = {
    title: "Our Team",
    description: "Meet our team",
};

function featured(src: any, dest: any): void {
    let i: number = 0;
    while (i < src.length) {
        const item: Post = src[i];
        if (item.acf?.featured) {
            src.splice(i, 1);
            dest.push(item);
        } else i++;
    }
}

export default async function Page(): Promise<ReactElement<any, any>> {
    let page: WordpressPage = await getPageById(208);
    const { isEnabled } = await draftMode();
    if (isEnabled) {
        // @ts-ignore
        page = await getPostRevisionsById(page.id);
    }
    let teamMembers: Post[] = await getAllTeamMembers();

    // Sort teamMembers by acf.sort_order
    teamMembers.sort((a: Post, b: Post): number => {
        // @ts-ignore
        const sortA: number = a.acf?.sort_order === "" ? Infinity : a.acf?.sort_order || 0;
        // @ts-ignore
        const sortB: number = b.acf?.sort_order === "" ? Infinity : b.acf?.sort_order || 0;
        return sortA - sortB;
    });

    for (const member of teamMembers) {
        if (member._embedded) {
            member._embedded.secondary_image = await getFeaturedMediaById(Number(member.acf?.secondary_image));
        }
    }

    let featuredTeamMembers: never[] = [];
    featured(teamMembers, featuredTeamMembers);

    return (
        <Section>
            <Container>
                <TeamWrapper
                    page={page}
                    pageHtml={{ '__html': page.content.rendered }}
                    teamMembers={teamMembers}
                    featuredTeamMembers={featuredTeamMembers}
                />
            </Container>
        </Section>
    );
}
