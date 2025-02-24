"use client";

import React from "react";
import ViewToggle from "@/components/projects/view-toggle";
import Project from "@/components/projects/project";

function transformSubsidiaryData(flatObject: { [x: string]: any; }) {
    // Create an empty object to store the grouped result
    const result = {};

    // Get all keys from the flat object that match our specific pattern
    const subsidiaryKeys = Object.keys(flatObject).filter(key =>
        /^subsidiary_\d+_(name|number)$/.test(key)
    );

    // Iterate through each matching key
    subsidiaryKeys.forEach(key => {
        // Extract the index and property name
        const match = key.match(/subsidiary_(\d+)_(\w+)/);

        if (match) {
            const [, index, property] = match;

            // Initialize the nested object if it doesn't exist
            // @ts-ignore
            if (!result[index]) {
                // @ts-ignore
                result[index] = {};
            }

            // Add the property to the nested object
            // Convert number strings to actual numbers
            // @ts-ignore
            result[index][property] = property === 'number' ?
                parseInt(flatObject[key], 10) :
                flatObject[key];
        }
    });

    return result;
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
                <div className="mx-90px grid grid-cols-16 gap-x-6 gap-y-16 projects-grid">
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
                <div className="mx-90px grid grid-cols-16 gap-x-6 gap-y-16 projects-index">
                    <span>Companies / Projects:</span>
                    <span>Subsidiaries:</span>
                    {_projects && _projects.map(
                        function (project: object, index: number) {
                            let subsidiaries;
                            if (project.block_data[1].innerBlocks[1].innerBlocks[0].attrs.data.subsidiary_0_name) {
                                subsidiaries = transformSubsidiaryData(project.block_data[1].innerBlocks[1].innerBlocks[0].attrs.data);
                                subsidiaries = Object.values(subsidiaries);
                            }

                            return (
                                <div className="project-row">
                                    <span>{project.block_data[0].attrs.data.number} {project.title.rendered}</span>
                                    {subsidiaries &&
                                        subsidiaries.map(
                                            function(subsidiary:any) {
                                                return <div>{subsidiary.number} {subsidiary.name}</div>;
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
