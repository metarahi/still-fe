"use client";

import { useRouter } from "next/navigation";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import parse, {domToReact} from "html-react-parser";
import Page = Property.Page;
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
// @ts-ignore
import {Property} from "csstype";
import DOMPurify from "isomorphic-dompurify";

export default function HomePage(page: Page) {
    const homePageDom = htmlFrom(page.data.content.rendered);

    function init_crossFade(element) {
        var setBackground = {
            // Convert nodelist of images to array
            crossFadeImages: [].slice.call(
                element.querySelectorAll('.slide')
            ),

            // Create random number 0 -> length of array
            randomize: function(arrayLength) {
                randomNumber = Math.floor(arrayLength * Math.random()); // range dynamically based on number of indexes in imagesArray
                return randomNumber;
            },
            // Load random image on page load
            setImageOnLoad: function(path) {
                setBackground.crossFadeImages[path].classList.add(
                    'active'
                );
                var active = element.querySelector('.active');
                return active;
            },

            // Set next image in DOM to crossFade__image--active (if at last image in DOM set first image)
            setNextImage: function(activeImage) {
                setTimeout(function() {
                    activeImage.classList.remove('active');
                    var nextImage;
                    if (activeImage.nextElementSibling !== null) {
                        nextImage = activeImage.nextElementSibling;
                    } else {
                        nextImage = element.querySelector('.slide');
                    }
                    nextImage.classList.add('active');
                    setTimeout(function() {
                        setBackground.setNextImage(nextImage);
                    }, 2000);
                }, 2000);
            }
        };

        // @ts-ignore
        var randomNumber = setBackground.randomize(
            setBackground.crossFadeImages.length
        );
        var activeImage = setBackground.setImageOnLoad(randomNumber);
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
