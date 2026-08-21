"use client";

import React from "react";
import { Post } from "@/lib/wordpress.d";
import Image from "next/image";
import Link from "next/link";

interface TeamMemberCardProps {
  teamMember: Post;
  index: number;
  featured?: boolean;
}

const TeamMemberCard = ({ teamMember, index, featured = false }: TeamMemberCardProps) => {

  const className = featured
    ? `featured-team-member featured-team-member-${index + 1}`
    : "";

  const primaryImage = teamMember._embedded?.primary_image?.media_details?.sizes?.full;
  const secondaryImage = teamMember._embedded?.secondary_image?.media_details?.sizes?.full;

  return (
    <div className={className} data-aos="fade-up">
      <div className="team-member-image">
        <Link href={'/our-team/' + teamMember.slug}>
          {primaryImage && (
            <Image
                src={primaryImage.source_url}
                alt={teamMember.title.rendered}
                className="primary"
                height={primaryImage.height}
                width={primaryImage.width}
            />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.source_url}
              alt={teamMember.title.rendered}
              className="secondary"
              height={secondaryImage.height}
              width={secondaryImage.width}
            />
          )}
        </Link>
      </div>
      <h2 className="h3-headings-and-pullquotes md:h2-headings-and-intros">
        <Link href={'/our-team/' + teamMember.slug}>{teamMember.title.rendered}</Link>
      </h2>
      <div className="small-caps-menu-button-lists">
        <Link href={'/our-team/' + teamMember.slug}>
          {teamMember.acf?.job_title}&nbsp;<span className="arrow">→</span>
        </Link>
      </div>
      <div className="paragraph" dangerouslySetInnerHTML={{__html: teamMember.block_data?.[0].innerHTML}}/>
    </div>
  );
};

export default TeamMemberCard;
