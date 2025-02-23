import {Container, Section} from "@/components/craft";
import {getAllTeamMembers, getPageById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React from "react";
import TeamWrapper from "@/components/team/team-wrapper";

export const metadata: Metadata = {
    title: "Our Team",
    description: "Meet our team",
};

function featured(src: any, dest: any)  {
    let i = 0;
    while ( i < src.length ) {
        const item = src[i];
        if (item.acf.featured) {
            src.splice(i,1);
            dest.push(item);
        }
        else i++;
    }
}

export default async function Page() {
    const page = await getPageById(208);
    const pageHtml = {'__html': page.content.rendered};
    let teamMembers = await getAllTeamMembers();
    let featuredTeamMembers = [];
    featured(teamMembers, featuredTeamMembers);

    return (
        <Section>
            <Container>
                <TeamWrapper page={page} pageHtml={pageHtml} teamMembers={teamMembers} featuredTeamMembers={featuredTeamMembers} />
            </Container>
        </Section>
    );
}
