// @ts-ignore
import {Property} from "csstype";
import Page = Property.Page;

interface Props {
    page: Page
    gridClass: string
    key: number
}
const Project: React.FC<Props> = ({page, gridClass}) => {
    const thumbnail = page._embedded['wp:featuredmedia'][0].media_details.sizes.medium;

    return (
        <div className={gridClass} key="">
            <a href={'/still-100/' + page.slug}>
                <img src={thumbnail.source_url} alt={page.title.rendered} width={thumbnail.width} height={thumbnail.height} />
            </a>
            <h2><a href={'/still-100/' + page.slug}>{page.title.rendered} <span className="arrow">→</span></a></h2>
        </div>
    );
}

export default Project;
