import {Container, Section} from "@/components/craft";
import {getAllProjects, getFeaturedMediaById, getPageById, getPostRevisionsById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React, {ReactElement} from "react";
import ProjectsWrapper from "@/components/projects/projects-wrapper";
import {Page as WordpressPage, Project} from "@/lib/wordpress.d";
import {draftMode} from "next/headers";
export const metadata: Metadata = {
    title: "STILL 100",
    description: "View all of our projects",
};

export default async function Page(): Promise<ReactElement<any, any>> {
    let page: WordpressPage = await getPageById(173);
    const { isEnabled } = await draftMode();
    if (isEnabled) {
        // @ts-ignore
        page = await getPostRevisionsById(page.id);
    }
    const projects: Project[] = await getAllProjects();
    for (const project of projects) {
        if (project._embedded) {
            project._embedded.still_100_page_image = await getFeaturedMediaById(Number(project.acf?.still_100_page_image));
        }
    }

    return (
        <Section>
            <Container>
                <ProjectsWrapper page={page} pageHtml={{'__html': page.content.rendered}} projects={projects}/>
            </Container>
        </Section>
    );
}
