// "use client";
import { Post } from "@/lib/wordpress.d";
import Image from "next/image";
import React, {ReactElement} from "react";
import Link from "next/link";

interface Props {
    page: Post
    gridClass: string
    key: number
}
const Project: React.FC<Props> = ({page, gridClass}: Props): ReactElement<any, any> => {
    const thumbnail: any | undefined = page._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium;

    return (
        <div className={gridClass} key=""
             data-aos="fade-up"
        >
            <Link href={'/still-100/' + page.slug}>
                <div className="img-wrapper">
                <Image
                    src={thumbnail.source_url}
                    alt={page.title.rendered}
                    height={thumbnail.height}
                    width={thumbnail.width}
                />
                    <span></span>
                </div>
            </Link>
            <h2><Link href={'/still-100/' + page.slug}>{page.title.rendered} <span className="arrow">→</span></Link></h2>
        </div>
    );
}

export default Project;
