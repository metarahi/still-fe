"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function NavLink({ href, text }: { href: string; text: string; }) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <Link
            className={'inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none text-primary underline-offset-4 hover:underline h-9 px-10 small-caps-menu-button-lists' + (isActive === true ? ' underline' : '')}
            href={href}
            key={text}
        >
            {text}
        </Link>
    )
}
