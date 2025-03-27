"use client";

import React, {ReactElement} from "react";
import { Post } from "@/lib/wordpress.d";
import TeamMemberCard from "./team-member-card";

const TeamWrapper: (page: any) => ReactElement = (page: any): ReactElement<any, any> => {
    const _page: any = page.page;
    const _pageHtml: any = page.pageHtml;
    let _teamMembers: any = page.teamMembers;
    let _featuredTeamMembers: any = page.featuredTeamMembers;

    _featuredTeamMembers = Object.values(_featuredTeamMembers).reverse();

    return (
        <div>
            <div
                className="mx-90px page-header our-team-page-header aos-hidden"
                data-aos="fade-up"
            >
                <h1 className="small-caps-heading">{_page.title.rendered}</h1>
                <div className="page-html" dangerouslySetInnerHTML={_pageHtml}/>
            </div>

            <div className="featured-team-members md:grid md:grid-cols-16 md:gap-6">
                {_featuredTeamMembers && _featuredTeamMembers.map((teamMember: Post, index: number) => (
                    <TeamMemberCard
                        teamMember={teamMember}
                        index={index}
                        featured={true}
                        key={index}
                    />
                ))}
            </div>

            <div className="team-members grid max-md:grid-cols-4 gap-x-7 md:grid-cols-16 md:gap-x-6 md:gap-y-16 mx-90px">
                {_teamMembers && _teamMembers.map((teamMember: Post, index: number) => {
                    const columnPositions: string[] = ["grid-start-2", "grid-start-7", "grid-start-12"];
                    const gridClass: string = columnPositions[index % 3];

                    return (
                        <div key={index} className={gridClass}>
                            <TeamMemberCard
                                teamMember={teamMember}
                                index={index}
                            />
                        </div>
                    );
                })}
            </div>
        </div>)
}

export default TeamWrapper;
