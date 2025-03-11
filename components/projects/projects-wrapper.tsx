"use client";

import React, {ReactElement} from "react";
import ViewToggle from "@/components/projects/view-toggle";
import Project from "@/components/projects/project";
import {Project as WordpressProject} from "@/lib/wordpress.d";
import Link from "next/link";

function transformSubsidiaryData(data: Record<string, any>): Record<string, any> {
    const groupedSubsidiaries: Record<string, any> = {};

    // Helper function to fetch keys matching the pattern
    const getMatchingKeys = (obj: Record<string, any>): string[] => {
        return Object.keys(obj).filter(key =>
            /^subsidiary_\d+_(name|number)$/.test(key)
        );
    };

    // Helper function to process a single key and update the result
    const processKey = (key: string): void => {
        const match: RegExpMatchArray | null = key.match(/subsidiary_(\d+)_(\w+)/);
        if (match) {
            const [, index, property] = match;
            if (!groupedSubsidiaries[index]) {
                groupedSubsidiaries[index] = {};
            }
            // Assign value based on property type
            groupedSubsidiaries[index][property] = property === 'number'
                ? parseInt(data[key], 10)
                : data[key];
        }
    };

    // Get all relevant keys and process them
    const matchingKeys: string[] = getMatchingKeys(data);
    matchingKeys.forEach(processKey);

    return groupedSubsidiaries;
}

const ProjectsWrapper: (page: any) => ReactElement = (page: any): ReactElement<any, any> => {
    const [activeView, setActiveView] = React.useState('overview');
    const _page: any = page.page;
    const _pageHtml: any = page.pageHtml;
    let _projects: any = page.projects;
    // Sort teamMembers by acf.sort_order
    _projects.sort((a: WordpressProject, b: WordpressProject): number => {
        // @ts-ignore
        const sortA: number = a.acf?.sort_order === "" ? Infinity : a.acf?.sort_order || 0;
        // @ts-ignore
        const sortB: number = b.acf?.sort_order === "" ? Infinity : b.acf?.sort_order || 0;
        return sortA - sortB;
    });
    let _projectsIndex = structuredClone(_projects).sort((a: any, b: any): number => a.block_data[0].attrs.data.number - b.block_data[0].attrs.data.number);

    return (
        <div>
            <div
                className="mx-90px page-header"
            >
                <h1 className="small-caps-heading">{_page.title.rendered}</h1>
                <div className="page-html" dangerouslySetInnerHTML={_pageHtml}/>
                <ViewToggle activeView={activeView} setActiveView={setActiveView} />
            </div>

            {activeView && activeView === 'overview' &&
                <div className="md:mx-90px grid max-md:grid-cols-2 gap-x-7 gap-y-7 md:grid-cols-16 md:gap-x-6 md:gap-y-16 projects-grid">
                    {_projects && _projects.map(
                        function (project: WordpressProject, index: number) {
                            const columnPositions = ["grid-start-2", "grid-start-7", "grid-start-12"];
                            const gridClass = columnPositions[index % 3];
                            return <Project page={project} gridClass={gridClass} key={index}></Project>
                        }
                    )}
                </div>
            }
            {activeView && activeView === 'index' &&
                <div className="mx-90px md:grid md:grid-cols-16 md:gap-x-6 projects-index">
                    <div className="project-index-header">
                        <p>Companies / Projects:</p>
                        <p>Subsidiaries:</p>
                    </div>
                    {_projectsIndex && _projectsIndex.map(
                        function renderProjectRow(project: WordpressProject, index: number): ReactElement {
                            const hasSubsidiaryData: boolean = !!project.block_data?.[1]?.innerBlocks?.[1]?.innerBlocks?.[0]?.attrs?.data?.subsidiary_0_name;
                            const subsidiaries: any[] | null = hasSubsidiaryData
                                ? Object.values(transformSubsidiaryData(project.block_data?.[1]?.innerBlocks?.[1]?.innerBlocks?.[0]?.attrs?.data))
                                : null;

                            const renderSubsidiary = (subsidiary: Record<string, any>, subIndex: number): ReactElement | null => {
                                if (!subsidiary.number) return null;
                                return (
                                    <div key={subIndex}>
                                        <span>{`0${subsidiary.number}`.slice(-2)}</span><span className="index-subsidiary-name">{subsidiary.name}</span>
                                    </div>
                                );
                            };

                            return (
                                <div className="project-row" key={index}>
                                    <span>
                                        <span>{project.block_data?.[0].attrs.data.number}</span><Link href={`/still-100/${project.slug}`} className="hover:border-b hover:border-black">{project.title.rendered}</Link>
                                    </span>
                                    {subsidiaries?.map(renderSubsidiary)}
                                </div>
                            );
                        }
                    )}
                </div>
            }
        </div>)
}

export default ProjectsWrapper;
