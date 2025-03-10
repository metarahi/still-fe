"use client";

// React and Next Imports
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Utility Imports
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.svg";
import MenuOpen from "@/public/menu-open.svg";

// Component Imports
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";

import { mainMenu } from "@/menu.config";
import MenuClose from "@/public/menu-close.svg";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const wait = () => new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="carousel"
          className="px-0 hover:bg-transparent focus-visible:bg-transparent md:hidden"
        >
          <Image src={MenuOpen} alt="Toggle menu" height="10" width="28" />
        </Button>
      </SheetTrigger>
      <SheetContent side="fade" className={closing ? 'closing' : ''}>
        <SheetHeader>
          <MobileLink
              href="/"
              className="transition-all flex gap-4 items-center position-absolute left-8"
              onOpenChange={setOpen}
          >
            <Image
                src={Logo}
                alt="Logo"
                loading="eager"
                width={72}
                height={15}
            ></Image>
          </MobileLink>
          <div className="p-3 px-0 h-10 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
            <Image src={MenuClose} alt="Close" height={20} width={20}
              onClick={function() {
                setClosing(true);
                wait().then(function() {
                  setOpen(false);
                  setClosing(false);
                })
              }}
            />
          </div>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-6rem)]">
          <div className="flex flex-col text-center h-[calc(100vh-6rem)] justify-center">
            {Object.entries(mainMenu).map(([key, href]) => (
              <MobileLink key={key} href={href} className="small-caps-menu-button-lists mobile-menu-link" onOpenChange={setOpen}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </MobileLink>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-lg", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
