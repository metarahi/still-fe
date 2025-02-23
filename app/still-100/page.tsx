import {Container, Section} from "@/components/craft";
import {getAllProjects, getPageById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React from "react";
import ProjectsWrapper from "@/components/projects/projects-wrapper";


export const metadata: Metadata = {
    title: "STILL 100",
    description: "View all of our projects",
};

export default async function Page() {
    const page = await getPageById(173);
    const pageHtml = {'__html': page.content.rendered};
    const projects = await getAllProjects();

    return (
        <Section>
            <Container>
                <ProjectsWrapper page={page} pageHtml={pageHtml} projects={projects}/>
            </Container>
        </Section>
    );
}
