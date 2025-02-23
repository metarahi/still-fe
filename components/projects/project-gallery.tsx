"use client"

import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselApi
} from "@/components/ui/carousel";
import Fade from "embla-carousel-fade";
import parse, {domToReact} from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

interface Props {
    content: any
}

const ProjectGallery: React.FC<Props> = ({content}) => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const gallery = htmlFrom(content.block_data[2].innerBlocks[0].innerBlocks[0].rendered, setApi);

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    return (
        <div className="project-gallery">
            {gallery}
            <div className="py-2 px-5 text-right">
                {current}/{count}
            </div>
        </div>
    )
}

function htmlFrom(htmlString: any, setApi: any) {
    const options = {
        htmlparser2: {
            lowerCaseTags: false,
        },
        replace(domNode: any) {
            if (!domNode.name) {
                return domNode;
            }

            if (domNode.name === 'carousel') {
                return <Carousel
                    setApi={setApi}
                    plugins={[
                        Fade()
                    ]}
                    opts={{ align: "start", loop: true }}
                    className="carousel-wrapper"
                >{domToReact(domNode.children, options)}
                    <div className="carousel-indicators">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
            }

            else if (domNode.name === 'carouselcontent') {
                return <CarouselContent>{domToReact(domNode.children, options)}</CarouselContent>
            }

            else if (domNode.name === 'carouselitem') {
                return <CarouselItem>{domToReact(domNode.children, options)}</CarouselItem>
            }

            return domNode;
        }
    };

    const cleanHtmlString = DOMPurify.sanitize(htmlString,
        {
            USE_PROFILES: { html: true },
            ADD_TAGS: ["carousel", "carouselcontent", "carouselitem"]
        });

    return parse(cleanHtmlString, options);
}


export default ProjectGallery;
