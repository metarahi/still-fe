"use client";

import React from "react";
import ViewToggle from "@/components/projects/view-toggle";
import Project from "@/components/projects/project";

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
        const match = key.match(/subsidiary_(\d+)_(\w+)/);
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
    const matchingKeys = getMatchingKeys(data);
    matchingKeys.forEach(processKey);

    return groupedSubsidiaries;
}

const ProjectsWrapper: (page: any) => React.JSX.Element = (page) => {
    const [activeView, setActiveView] = React.useState('overview');
    const _page = page.page;
    const _pageHtml = page.pageHtml;
    let _projects = page.projects;

    if (activeView === 'index') {
        _projects = _projects.sort((a, b) => a.block_data[0].attrs.data.number - b.block_data[0].attrs.data.number);
    }

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
                        function (project: unknown, index: number) {
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
                    {_projects && _projects.map(
                        function (project: object, index: number) {
                            let subsidiaries;
                            if (project.block_data[1].innerBlocks[1].innerBlocks[0].attrs.data.subsidiary_0_name) {
                                subsidiaries = transformSubsidiaryData(project.block_data[1].innerBlocks[1].innerBlocks[0].attrs.data);
                                subsidiaries = Object.values(subsidiaries);
                            }

                            return (
                                <div className="project-row" key={index}>
                                    <span><span>{project.block_data[0].attrs.data.number}</span>{project.title.rendered}</span>
                                    {subsidiaries &&
                                        subsidiaries.map(
                                            function (subsidiary: any, index: number) {
                                                if (subsidiary.number) {
                                                    return <div key={index}><span>{("0" + subsidiary.number).slice (-2)}</span>{subsidiary.name}</div>;
                                                }
                                            }
                                        )}
                                </div>
                            )
                        }
                    )}
                </div>
            }
        </div>)
}

export default ProjectsWrapper;
