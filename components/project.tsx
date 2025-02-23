// @ts-ignore
import {Property} from "csstype";
import DOMPurify from "isomorphic-dompurify";
import Page = Property.Page;
import Image from "next/image";

interface Props {
    page: Page
    gridClass: string
    key: number
}
const Project: React.FC<Props> = ({page, gridClass}) => {
    const thumbnail = page._embedded['wp:featuredmedia'][0].media_details.sizes.medium;

    return (
        <div className={gridClass} key="">
            <a href={page.link}>
                <img src={thumbnail.source_url} alt={page.title.rendered} width={thumbnail.width} height={thumbnail.height} />
            </a>
            <h2><a href={page.link}>{page.title.rendered} <span className="arrow">→</span></a></h2>
        </div>
    );
}

export default Project;
