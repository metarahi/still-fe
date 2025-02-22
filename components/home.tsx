"use client";

import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import parse, {domToReact} from "html-react-parser";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
// @ts-ignore
import {Property} from "csstype";
import DOMPurify from "isomorphic-dompurify";
import Page = Property.Page;

export default function HomePage(page: Page) {
    const homePageDom = htmlFrom(page.data.content.rendered);

    function init_crossFade(element: Element) {
        const setBackground = {
            crossFadeImages: [].slice.call(
                element.querySelectorAll('.slide')
            ),

            randomize: function(arrayLength: number) {
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

        let randomNumber = setBackground.randomize(
            setBackground.crossFadeImages.length
        );
        const activeImage: Element | null = setBackground.setImageOnLoad(randomNumber);
        setBackground.setNextImage(activeImage);
    }

    try {
        document.querySelectorAll('.project-previews .inner').forEach(
            function(currentValue) {
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
        replace(domNode: any) {
            if (!domNode.name) {
                return domNode;
            }

            // if (domNode.name === 'SpecialButton') {
            //     console.log(domNode.attribs)
            //     return <SpecialButton color={domNode.attribs.color}>{domToReact(domNode.children)}</SpecialButton>
            // }

            if (domNode.name === 'carousel') {
                return <Carousel
                    plugins={[
                        Autoplay({
                            delay: 4000
                        }),
                        Fade()
                    ]}
                    opts={{ align: "start", loop: true }}
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

    const cleanHtmlString = DOMPurify.sanitize(htmlString,
        {
            USE_PROFILES: { html: true },
            ADD_TAGS: ["carousel", "carouselcontent", "carouselitem"]
        });

    return parse(cleanHtmlString, options);
}
