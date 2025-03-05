"use client"

import { useEffect } from 'react'
import AOS from "aos";

export const AOSInit = () => {
    useEffect(() => {
        const elementsToAnimate = document.querySelectorAll('.aos-fade-up');
        elementsToAnimate.forEach(function (element) {
            element.setAttribute('data-aos', 'fade-up');
        });

        AOS.init({
            easing: 'ease-in-out',
            duration: 400,
            offset: 120,
            delay: 0,
        });
    }, [])

    return null
}
