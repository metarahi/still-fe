"use client";

import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import parse, {domToReact} from "html-react-parser";
import Autoplay from "embla-carousel-autoplay";
import Fade from "@/lib/embla-carousel-fade-custom";
// @ts-ignore
import {Property} from "csstype";
import DOMPurify from "isomorphic-dompurify";
import Page = Property.Page;
import {ReactElement, useEffect} from "react";
import AOS from "aos";

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
                if (activeImage !== null) {
                    activeImage.classList.remove('active');
                    let nextImage: Element | null = element.querySelector('.slide');
                    if (activeImage.nextElementSibling !== null) {
                        nextImage = activeImage.nextElementSibling;
                    }
                    if (nextImage !== null) {
                        nextImage.classList.add('active');
                        // setBackground.setNextImage(nextImage);
                    }
                }
            }
        };

        let randomNumber: number = setBackground.randomize(
            setBackground.crossFadeImages.length
        );
        const activeImage: Element | null = setBackground.setImageOnLoad(randomNumber);
        setBackground.setNextImage(activeImage);
    }

    useEffect((): void => {
        const projectPreviews: NodeListOf<Element> = document.querySelectorAll('.project-previews .inner');

        function handleTimer(): void {
            const random: number = Math.floor(Math.random() * projectPreviews.length);
            init_crossFade(projectPreviews[random]);
        }

        let timer = setInterval(handleTimer, 4000);

        projectPreviews.forEach(function(element: Element): void {
            element.addEventListener("mouseover", (event): void => {
                clearInterval(timer);
            });
            element.addEventListener("mouseout", (event): void => {
                setInterval(handleTimer, 4000);
            });
        })
    }, []);

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

            else if (domNode.attribs && domNode.attribs.class && domNode.attribs.class.includes('aos-fade-up')) {
                return <domNode.name className={domNode.attribs.class} data-aos="fade-up">{domToReact(domNode.children, options)}</domNode.name>
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
