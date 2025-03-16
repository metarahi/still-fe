"use client"

import {useEffect} from 'react'
import AOS from "aos";

export const AOSInit = (): null => {
    useEffect((): void => {
        AOS.init({
            easing: 'ease-in-out',
            duration: 350,
            offset: 120,
            delay: 0,
        });
    }, []);

    return null;
}
