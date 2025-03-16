"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {ReactElement} from "react";

export function NavLink({ href, text }: { href: string; text: string; }): ReactElement<any, any> {
    const pathname: string = usePathname();
    const isActive: boolean = pathname.startsWith(href);

    return (
        <Link
            className={'inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none text-primary underline underline-offset-4 decoration-transparent hover:decoration-black h-9 px-10 small-caps-menu-button-lists' + (isActive ? ' decoration-black' : '')}
            href={href}
            key={text}
        >
            {text}
        </Link>
    )
}
