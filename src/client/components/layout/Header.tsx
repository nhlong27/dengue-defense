import React from "react";
import dynamic from "next/dynamic";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/client/components/ui/menubar";
import { Skeleton } from "../ui/skeleton";

const Nav = dynamic(() => import("./Nav"), {
  loading: () => (
    <><nav className="mx-auto hidden h-full w-full lg:flex">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              {" "}
              <Skeleton className="h-8 w-20" />
            </MenubarTrigger>
            <MenubarTrigger>
              {" "}
              <Skeleton className="h-8 w-20" />
            </MenubarTrigger>
            <MenubarTrigger className="ml-auto">
              <Skeleton className="h-8 w-20" />
            </MenubarTrigger>
            <MenubarTrigger>
              {" "}
              <Skeleton className="h-8 w-20" />
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </nav>
    </>
  ),
  ssr: false,
});

export default function Header() {
  return (
    <div className="sticky top-0 z-20 lg:hidden w-full bg-white dark:bg-black md:h-16 h-12">
      <Nav />
    </div>
  );
}
