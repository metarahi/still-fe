import {Container, Section} from "@/components/craft";
import {getAllProjects, getPageById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React, {ReactElement} from "react";
import ProjectsWrapper from "@/components/projects/projects-wrapper";
import {Page as WordpressPage, Project} from "@/lib/wordpress.d";

export const revalidate = 600;
export const metadata: Metadata = {
    title: "STILL 100",
    description: "View all of our projects",
};

export default async function Page(): Promise<ReactElement<any, any>> {
    const page: WordpressPage = await getPageById(173);
    const projects: Project[] = await getAllProjects();

    return (
        <Section>
            <Container>
                <ProjectsWrapper page={page} pageHtml={{'__html': page.content.rendered}} projects={projects}/>
            </Container>
        </Section>
    );
}
