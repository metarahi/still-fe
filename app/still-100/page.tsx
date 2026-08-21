import {Container, Section} from "@/components/craft";
import {getAllProjects, getPageById, getPostRevisionsById} from "@/lib/wordpress";
import type {Metadata} from "next";
import React, {ReactElement} from "react";
import ProjectsWrapper from "@/components/projects/projects-wrapper";
import {Page as WordpressPage, Project} from "@/lib/wordpress.d";
import {draftMode} from "next/headers";
export const metadata: Metadata = {
    title: "Portfolio",
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
        if (!project._embedded) {
            project._embedded = {};
        }
        // ACF returns the image URL directly, not an ID
        const imageUrl = project.acf?.still_100_page_image;
        if (imageUrl && typeof imageUrl === 'string') {
            project._embedded.still_100_page_image = {
                source_url: imageUrl,
                media_details: {
                    sizes: {
                        full: {
                            source_url: imageUrl,
                            width: 800,
                            height: 600
                        }
                    }
                }
            };
        }
    }

    // Serialize data to remove any non-serializable properties (functions, circular refs)
    const serializedProjects = JSON.parse(JSON.stringify(projects));

    return (
        <Section>
            <Container>
                <ProjectsWrapper page={page} pageHtml={{'__html': page.content.rendered}} projects={serializedProjects}/>
            </Container>
        </Section>
    );
}
