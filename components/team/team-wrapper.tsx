"use client";

import React from "react";
import {getFeaturedMediaById} from "@/lib/wordpress";

const TeamWrapper: (page: any) => React.JSX.Element = (page) => {
    const _page = page.page;
    const _pageHtml = page.pageHtml;
    let _teamMembers = page.teamMembers;
    let _featuredTeamMembers: any = page.featuredTeamMembers;

    _featuredTeamMembers = Object.values(_featuredTeamMembers).reverse();

    return (
        <div>
            <div
                className="mx-90px page-header"
            >
                <h1>{_page.title.rendered}</h1>
                <div className="page-html" dangerouslySetInnerHTML={_pageHtml}/>
            </div>

            <div className="featured-team-members grid grid-cols-16 gap-6">
                {_featuredTeamMembers && _featuredTeamMembers.map(
                    function (teamMember: unknown, index: number) {
                        // const secondaryImage = await getFeaturedMediaById(teamMember.acf.secondary_image);
                        // console.log(secondaryImage);
                        return (
                            <div key={index} className={"featured-team-member-" + (index + 1)}>
                                <div>
                                    <img
                                        src={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url}
                                        alt={teamMember.title.rendered}/>
                                </div>
                                <h2 className="h2-headings-and-intros">{teamMember.title.rendered}</h2>
                                <div className="small-caps-menu-button-lists">{teamMember.acf.job_title} <span className="arrow">→</span></div>
                                <div className="paragraph" dangerouslySetInnerHTML={{__html: teamMember.block_data[0].innerHTML}} />
                            </div>
                        )
                    }
                )}
            </div>

            <div className="team-members grid grid-cols-16 gap-x-6 gap-y-16 mx-90px">
                {_teamMembers && _teamMembers.map(
                    function (teamMember: unknown, index: number) {
                        const columnPositions = ["grid-start-2", "grid-start-7", "grid-start-12"];
                        const gridClass = columnPositions[index % 3];
                        // const secondaryImage = await getFeaturedMediaById(teamMember.acf.secondary_image);
                        // console.log(secondaryImage);
                        return (
                            <div key={index} className={gridClass}>
                                <div>
                                    <img
                                        src={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url}
                                        alt={teamMember.title.rendered}/>
                                </div>
                                <h2 className="h2-headings-and-intros">{teamMember.title.rendered}</h2>
                                <div className="small-caps-menu-button-lists">{teamMember.acf.job_title} <span className="arrow">→</span></div>
                                <div className="paragraph" dangerouslySetInnerHTML={{__html: teamMember.block_data[0].innerHTML}} />
                            </div>
                        )
                    }
                )}
            </div>
        </div>)
}

export default TeamWrapper;
