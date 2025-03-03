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
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

import { mainMenu } from "@/menu.config";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

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
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="text-left">
            <MobileLink
              href="/"
              className="flex items-center"
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
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)]">
          <div className="flex flex-col text-center">
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
