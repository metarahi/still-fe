import { Page } from "@/lib/wordpress.d";
import Image from "next/image";
import React from "react";
import Link from "next/link";

interface Props {
    page: Page
    gridClass: string
    key: number
}
const Project: React.FC<Props> = ({page, gridClass}) => {
    const thumbnail = page._embedded['wp:featuredmedia'][0].media_details.sizes.medium;

    return (
        <div className={gridClass} key="">
            <Link href={'/still-100/' + page.slug}>
                <Image
                    src={thumbnail.source_url}
                    alt={page.title.rendered}
                    height={thumbnail.height}
                    width={thumbnail.width}
                />
            </Link>
            <h2><Link href={'/still-100/' + page.slug}>{page.title.rendered} <span className="arrow">→</span></Link></h2>
        </div>
    );
}

export default Project;
