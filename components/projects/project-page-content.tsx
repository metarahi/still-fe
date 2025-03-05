import parse, {domToReact} from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import React, {ReactElement} from "react";
import Image from "next/image";
import {Post} from "@/lib/wordpress.d";
import ProjectGallery from "@/components/projects/project-gallery";

interface Props {
    post: Post,
    featuredMedia: any
}

const ProjectPageContent: React.FC<Props> = ({post, featuredMedia}: Props): ReactElement<any, any> => {
    const projectPageDom: string | ReactElement | ReactElement[] = htmlFrom(post.content.rendered);

    function htmlFrom(htmlString: any) {
        const options = {
            htmlparser2: {
                lowerCaseTags: false,
            },
            replace(domNode: any): any {
                if (!domNode.name) {
                    return domNode;
                }

                if (featuredMedia && domNode.attribs && domNode.attribs.class && domNode.attribs.class.includes("project-body")) {
                    return <div className="project-body">
                        <Image
                            className="w-full md:hidden"
                            src={featuredMedia.source_url}
                            alt={post.title.rendered}
                            height={featuredMedia.media_details.height}
                            width={featuredMedia.media_details.width}
                        />
                        <p>{domToReact(domNode.children, options)}</p>
                        <ProjectGallery content={post} className="md:hidden" />
                    </div>

                }

                return domNode;
            }
        };

        const cleanHtmlString: string = DOMPurify.sanitize(htmlString,
            {
                USE_PROFILES: { html: true },
            });

        return parse(cleanHtmlString, options);
    }

    return (<div className="rendered-content">
        {projectPageDom}
    </div>);
}

export default ProjectPageContent;
