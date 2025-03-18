"use client"

import {useEffect} from 'react'
import AOS from "aos";
import { usePathname } from 'next/navigation';

export const AOSInit = (): null => {
    const pathname = usePathname();

    useEffect(() => {
        // Projects
        const projectEndorsements = document.querySelector('.project-endorsements');
        if (projectEndorsements) {
            projectEndorsements.setAttribute('data-aos', 'fade-up');
        }
        const collaborationInterests = document.querySelector('.project-collaboration');
        if (collaborationInterests) {
            collaborationInterests.setAttribute('data-aos', 'fade-up');
        }
        const projectLink = document.querySelector('.project-link');
        if (projectLink) {
            projectLink.setAttribute('data-aos', 'fade-up');
        }
    }, [pathname]);

    useEffect((): void => {
        AOS.init({
            easing: 'ease-in-out',
            duration: 500,
            offset: 120,
            delay: 0,
        });
    }, []);

    useEffect(() => {
        const hiddenElements = document.querySelectorAll('.aos-hidden');
        hiddenElements.forEach(element => {
            element.classList.remove('aos-animate');
            setTimeout(function(){
                element.classList.remove('aos-hidden');
                element.classList.add('aos-animate');
            }, 10);
        });
    }, [pathname]);

    return null;
}
