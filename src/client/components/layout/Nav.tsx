import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/client/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/client/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { signOut } from "next-auth/react";

const Nav = () => {
  return (
    <>
      <nav className="mx-auto flex h-full w-11/12 items-center lg:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="w-[18rem]">
            <SheetHeader>
              <SheetTitle>Are you sure absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div className="relative flex h-full w-20 items-center justify-center">
          {/* <Image /> */}
          Logo
        </div>
        <ModeToggle />
        <Menubar className="ml-auto">
          <MenubarMenu>
            <MenubarTrigger>Avatar</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Print</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>
      <nav className="hidden h-full w-full lg:flex lg:flex-col">
        <div className="relative flex h-16 w-full items-center justify-center">
          {/* <Image /> */}
          Logo
        </div>
        <Menubar className="mt-auto">
          <MenubarMenu>
            <MenubarTrigger>Avatar</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Share</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <button
                  onClick={() => {
                    signOut()
                      .then((res) => console.log(res))
                      .catch((err) => console.log(err));
                  }}
                >
                  Sign out
                </button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>
    </>
  );
};

export default Nav;
