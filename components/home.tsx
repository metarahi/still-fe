"use client";

import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import parse, {domToReact} from "html-react-parser";
import Autoplay from "embla-carousel-autoplay";
import Fade from "@/lib/embla-carousel-fade-custom";
// @ts-ignore
import {Property} from "csstype";
import DOMPurify from "isomorphic-dompurify";
import Page = Property.Page;
import {ReactElement} from "react";

export default function HomePage(page: Page): ReactElement<any, any> {
    const homePageDom = htmlFrom(page.data.content.rendered);

    function init_crossFade(element: Element) {
        const setBackground = {
            crossFadeImages: [].slice.call(
                element.querySelectorAll('.slide')
            ),

            randomize: function(arrayLength: number): number {
                return Math.floor(arrayLength * Math.random());
            },
            setImageOnLoad: function(path: number) {
                // @ts-ignore
                setBackground.crossFadeImages[path].classList.add(
                    'active'
                );
                return element.querySelector('.active');
            },

            setNextImage: function(activeImage: Element | null) {
                setTimeout(function() {
                    if (activeImage !== null) {
                        activeImage.classList.remove('active');
                        let nextImage: Element | null = element.querySelector('.slide');
                        if (activeImage.nextElementSibling !== null) {
                            nextImage = activeImage.nextElementSibling;
                        }
                        if (nextImage !== null) {
                            nextImage.classList.add('active');
                            setTimeout(function() {
                                setBackground.setNextImage(nextImage);
                            }, 2000);
                        }
                    }
                }, 2000);
            }
        };

        let randomNumber: number = setBackground.randomize(
            setBackground.crossFadeImages.length
        );
        const activeImage: Element | null = setBackground.setImageOnLoad(randomNumber);
        setBackground.setNextImage(activeImage);
    }

    try {
        document.querySelectorAll('.project-previews .inner').forEach(
            function(currentValue: Element): void {
                init_crossFade(currentValue);
            }
        )
    } catch (ev) {
        // do nothing.
    }

    return (
        <div>
            {homePageDom}
        </div>
    );
}

function htmlFrom(htmlString: any) {
    const options = {
        htmlparser2: {
            lowerCaseTags: false,
        },
        replace(domNode: any): any {
            if (!domNode.name) {
                return domNode;
            }

            if (domNode.name === 'carousel') {
                return <Carousel
                    plugins={[
                        Autoplay({
                            delay: 4000
                        }),
                        Fade()
                    ]}
                    opts={{ align: "start", loop: true, duration: 60 }}
                    className="carousel-wrapper"
                >{domToReact(domNode.children, options)}</Carousel>
            }

            else if (domNode.name === 'carouselcontent') {
                return <CarouselContent>{domToReact(domNode.children, options)}</CarouselContent>
            }

            else if (domNode.name === 'carouselitem') {
                return <CarouselItem>{domToReact(domNode.children, options)}</CarouselItem>
            }

            else if (domNode.name === 'details') {
                return <div className="details-wrapper">{domToReact(domNode.children, options)}</div>
            }

            else if (domNode.name === 'summary') {
                return <div className="details-summary">{domToReact(domNode.children, options)}</div>
            }

            return domNode;
        }
    };

    const cleanHtmlString: string = DOMPurify.sanitize(htmlString,
        {
            USE_PROFILES: { html: true },
            ADD_TAGS: ["carousel", "carouselcontent", "carouselitem"]
        });

    return parse(cleanHtmlString, options);
}
