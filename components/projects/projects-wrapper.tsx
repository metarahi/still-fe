"use client";

import React, {ReactElement} from "react";
import Project from "@/components/projects/project";
import {Project as WordpressProject} from "@/lib/wordpress.d";

const ProjectsWrapper: (page: any) => ReactElement = (page: any): ReactElement<any, any> => {
    const _page: any = page.page;
    const _pageHtml: any = page.pageHtml;
    let _projects: any = page.projects;
    // Sort projects by acf.sort_order
    _projects.sort((a: WordpressProject, b: WordpressProject): number => {
        // @ts-ignore
        const sortA: number = a.acf?.sort_order === "" ? Infinity : a.acf?.sort_order || 0;
        // @ts-ignore
        const sortB: number = b.acf?.sort_order === "" ? Infinity : b.acf?.sort_order || 0;
        return sortA - sortB;
    });

    return (
        <div>
            <div
                className="mx-90px page-header aos-hidden"
                data-aos="fade-up"
            >
                <h1 className="small-caps-heading">{_page.title.rendered}</h1>
                <div className="page-html" dangerouslySetInnerHTML={_pageHtml}/>
            </div>

            <div className="md:mx-90px grid max-md:grid-cols-2 gap-x-7 gap-y-7 md:grid-cols-16 md:gap-x-6 md:gap-y-16 projects-grid">
                {_projects && _projects.map(
                    function (project: WordpressProject, index: number) {
                        const columnPositions = ["grid-start-2", "grid-start-7", "grid-start-12"];
                        const gridClass = columnPositions[index % 3];
                        return <Project page={project} gridClass={gridClass} key={index}></Project>
                    }
                )}
            </div>
        </div>)
}

export default ProjectsWrapper;
