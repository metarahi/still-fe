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
        // Get all slides in this element
        const slides = element.querySelectorAll('.slide');
        if (!slides || slides.length === 0) return;
        
        // First ensure all slides have active class removed
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Find current active slide (if any)
        const currentActive = element.querySelector('.slide.active');
        
        // Determine next slide
        let nextIndex = 0;
        
        if (currentActive) {
            // Find the index of the current active slide
            for (let i = 0; i < slides.length; i++) {
                if (slides[i] === currentActive) {
                    // Use the next slide, or wrap around to the first
                    nextIndex = (i + 1) % slides.length;
                    break;
                }
            }
        } else {
            // If no active slide, pick a random one
            nextIndex = Math.floor(Math.random() * slides.length);
        }
        
        // Add active class to the next slide
        slides[nextIndex].classList.add('active');
    }

    useEffect((): void => {
        const projectPreviews: NodeListOf<Element> = document.querySelectorAll('.project-previews .inner');
        if (!projectPreviews || projectPreviews.length === 0) return;
        
        // Initial setup - set initial slide for each preview
        projectPreviews.forEach(element => {
            init_crossFade(element);
        });
        
        // Function to handle timer-based transitions
        function handleTimer(): void {
            if (projectPreviews.length > 0) {
                // Choose a random slider to update
                const randomIndex = Math.floor(Math.random() * projectPreviews.length);
                const targetElement = projectPreviews[randomIndex];
                
                // Transition to the next slide
                init_crossFade(targetElement);
            }
        }
        
        // Start the timer
        let timer = setInterval(handleTimer, 4000);
        
        // Set up event listeners for pause/resume on hover
        const cleanupListeners: (() => void)[] = [];
        
        projectPreviews.forEach(element => {
            const mouseoverHandler = (): void => {
                clearInterval(timer);
                timer = 0;
            };
            
            const mouseoutHandler = (): void => {
                if (timer) clearInterval(timer);
                timer = setInterval(handleTimer, 4000);
            };
            
            element.addEventListener("mouseover", mouseoverHandler);
            element.addEventListener("mouseout", mouseoutHandler);
            
            cleanupListeners.push(() => {
                element.removeEventListener("mouseover", mouseoverHandler);
                element.removeEventListener("mouseout", mouseoutHandler);
            });
        });
        
        // Cleanup function to prevent memory leaks
        return () => {
            if (timer) clearInterval(timer);
            cleanupListeners.forEach(cleanup => cleanup());
        };
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

            else if (domNode.attribs && domNode.attribs.href && domNode.attribs.class && domNode.attribs.class.includes('aos-fade-up')) {
                return <domNode.name href={domNode.attribs.href} className={domNode.attribs.class} data-aos="fade-up">{domToReact(domNode.children, options)}</domNode.name>
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
