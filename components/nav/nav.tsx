"use client";

import {cn} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import {mainMenu} from "@/menu.config";
import {Button} from "@/components/ui/button";
import {NavLink} from "@/components/nav/nav-link";
import {MobileNav} from "@/components/nav/mobile-nav";

export default function Nav({ className, children, id }: NavProps) {
    let prevScrollPos = window.pageYOffset;

    window.addEventListener('scroll', function() {
        const currentScrollPos = window.pageYOffset;

        if (prevScrollPos < currentScrollPos || currentScrollPos === 0) {
            document.querySelector('nav').classList.remove('show');
        } else {
            document.querySelector('nav').classList.add('show');
        }

        prevScrollPos = currentScrollPos;
    });

    return (
        <nav
            className={cn('z-50 top-0 bg-transparent absolute w-full', className)}
            id={id}
        >
            <div
                id="nav-container"
                className="max-w-full mx-auto py-4 px-6 sm:px-8 flex justify-center items-center"
            >
                <Link
                    className="hover:opacity-75 transition-all flex gap-4 items-center position-absolute left-8"
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
                        {Object.entries(mainMenu).map(([key, href]) => (
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
