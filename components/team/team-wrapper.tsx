"use client";

import React from "react";
import { Post } from "@/lib/wordpress.d";
import Image from "next/image";
import Link from "next/link";

interface TeamWrapperProps {
    featuredTeamMembers?: any[]
}

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
                <h1 className="small-caps-heading">{_page.title.rendered}</h1>
                <div className="page-html" dangerouslySetInnerHTML={_pageHtml}/>
            </div>

            <div className="featured-team-members grid grid-cols-16 gap-6">
                {_featuredTeamMembers && _featuredTeamMembers.map(
                    function (teamMember: Post, index: number) {
                        return (
                            <div key={index} className={"featured-team-member-" + (index + 1)}>
                                <div className="team-member-image">
                                    <Link href={'/our-team/' + teamMember.slug}>
                                        <Image
                                            src={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url}
                                            alt={teamMember.title.rendered}
                                            className="primary"
                                            height={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.height}
                                            width={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.width}
                                        />
                                        <Image
                                            src={teamMember._embedded.secondary_image.media_details.sizes.full.source_url}
                                            alt={teamMember.title.rendered}
                                            className="secondary"
                                            height={teamMember._embedded.secondary_image.media_details.sizes.full.height}
                                            width={teamMember._embedded.secondary_image.media_details.sizes.full.width}
                                        />
                                    </Link>

                                </div>
                                <h2 className="h2-headings-and-intros"><Link href={'/our-team/' + teamMember.slug}>{teamMember.title.rendered}</Link>
                                </h2>
                                <div className="small-caps-menu-button-lists"><Link href={'/our-team/' + teamMember.slug}>{teamMember.acf.job_title}
                                    <span
                                        className="arrow">→</span></Link></div>
                                <div className="paragraph"
                                     dangerouslySetInnerHTML={{__html: teamMember.block_data[0].innerHTML}}/>
                            </div>
                        )
                    }
                )}
            </div>

            <div className="team-members grid grid-cols-16 gap-x-6 gap-y-16 mx-90px">
                {_teamMembers && _teamMembers.map(
                    function (teamMember: Post, index: number) {
                        const columnPositions = ["grid-start-2", "grid-start-7", "grid-start-12"];
                        const gridClass = columnPositions[index % 3];

                        return (
                            <div key={index} className={gridClass}>
                                <div className="team-member-image">
                                    <Link href={'/our-team/' + teamMember.slug}>
                                        <Image
                                            src={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url}
                                            alt={teamMember.title.rendered}
                                            className="primary"
                                            height={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.height}
                                            width={teamMember._embedded['wp:featuredmedia'][0].media_details.sizes.full.width}
                                        />
                                        <Image
                                            src={teamMember._embedded.secondary_image.media_details.sizes.full.source_url}
                                            alt={teamMember.title.rendered}
                                            className="secondary"
                                            height={teamMember._embedded.secondary_image.media_details.sizes.full.height}
                                            width={teamMember._embedded.secondary_image.media_details.sizes.full.width}
                                        />
                                    </Link>
                                </div>
                                <h2 className="h2-headings-and-intros"><Link href={'/our-team/' + teamMember.slug}>{teamMember.title.rendered}</Link>
                                </h2>
                                <div className="small-caps-menu-button-lists"><Link href={'/our-team/' + teamMember.slug}>{teamMember.acf.job_title}
                                    <span
                                        className="arrow">→</span></Link></div>
                                <div className="paragraph"
                                     dangerouslySetInnerHTML={{__html: teamMember.block_data[0].innerHTML}}/>
                            </div>
                        )
                    }
                )}
            </div>
        </div>)
}

export default TeamWrapper;
