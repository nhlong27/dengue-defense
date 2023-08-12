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
import { Github, Linkedin, LogOut, Menu, User } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { signOut } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/router";

const Nav = () => {
  const router = useRouter();
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
        <Menubar className="ml-auto mr-4 rounded-full p-0">
          <MenubarMenu>
            <MenubarTrigger className="rounded-full p-0">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent className="mr-12">
              <MenubarItem className="flex gap-3">
                <User size={15} />
                Profile
              </MenubarItem>
              <MenubarItem>
                <Link
                  href="https://github.com/nhlong27/dengue-defense"
                  target="_blank"
                  className="flex w-full items-center gap-3"
                >
                  <Github size={15} />
                  Visit Repo
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Link
                  href="https://www.linkedin.com/in/long-nguyen-95517b250/"
                  target="_blank"
                  className="flex w-full items-center gap-3"
                >
                  <Linkedin size={15} />
                  Check out Linkedin
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="flex gap-3">
                <LogOut size={15} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut()
                      .then((res) => console.log(res))
                      .catch((err) => console.log(err));
                  }}
                >
                  Sign out
                </Button>
              </MenubarItem>
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
            <MenubarTrigger className="rounded-full p-0">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent className="mr-12">
              <MenubarItem className="flex gap-3">
                <User size={15} />
                Profile
              </MenubarItem>
              <MenubarItem>
                <Link
                  href="https://github.com/nhlong27/dengue-defense"
                  target="_blank"
                  className="flex w-full items-center gap-3"
                >
                  <Github size={15} />
                  Visit Repo
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <Link
                  href="https://www.linkedin.com/in/long-nguyen-95517b250/"
                  target="_blank"
                  className="flex w-full items-center gap-3"
                >
                  <Linkedin size={15} />
                  Check out Linkedin
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem className="flex gap-3">
                <LogOut size={15} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut()
                      .then(() => {
                        toast({ title: "Sign out successfully" });
                        void router.push("/");
                      })
                      .catch((err) => console.log(err));
                  }}
                >
                  Sign out
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>
    </>
  );
};

export default Nav;
