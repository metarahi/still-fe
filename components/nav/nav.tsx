"use client";

import {cn} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import {mainMenu} from "@/menu.config";
import {Button} from "@/components/ui/button";
import {NavLink} from "@/components/nav/nav-link";
import {MobileNav} from "@/components/nav/mobile-nav";
import {ReactElement, useEffect} from "react";

export default function Nav({ className, children, id }: NavProps): ReactElement<any, any> {
    useEffect((): void => {
        let prevScrollPos: number = window.pageYOffset;

        window.addEventListener('scroll', function () {
            const currentScrollPos: number = window.pageYOffset;
            const nav: HTMLElement | null = document.querySelector('nav');

            if (prevScrollPos < currentScrollPos || currentScrollPos === 0) {
                nav && nav.classList.remove('show');
            } else {
                nav && nav.classList.add('show');
            }

            if (prevScrollPos < currentScrollPos) {
                nav && nav.classList.add('hidden-scroll');
            } else {
                nav && nav.classList.remove('hidden-scroll');
            }

            if (currentScrollPos === 0) {
                nav && nav.classList.remove('show');
                nav && nav.classList.remove('hidden-scroll');
            }

            prevScrollPos = currentScrollPos;
        });
    });

    return (
        <nav
            className={cn('z-50 top-0 bg-transparent absolute w-full', className)}
            id={id}
        >
            <div
                id="nav-container"
                className="max-w-full mx-auto py-4 px-7 sm:px-8 flex justify-end md:justify-center items-center"
            >
                <Link
                    className="flex gap-4 items-center position-absolute left-8"
                    href="/"
                >
                    <Image
                        src={Logo}
                        alt="Logo"
                        loading="eager"
                        width={72}
                        height={15}
                    ></Image>
                </Link>
                {children}
                <div className="flex items-center gap-2">
                    <div className="mx-2 hidden md:flex">
                        {Object.entries(mainMenu).map(([key, href]: [string, string]): ReactElement<any, any> => (
                            <Button key={href} asChild variant="link" size="menu">
                                <NavLink href={href} text={key.charAt(0).toUpperCase() + key.slice(1)}></NavLink>
                            </Button>
                        ))}
                    </div>
                    <MobileNav />
                </div>
            </div>
        </nav>
    );
};
