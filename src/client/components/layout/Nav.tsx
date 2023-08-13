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
import {
  Github,
  Linkedin,
  LogOut,
  Menu,
  User,
  UserCircle2,
} from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { signOut, useSession } from "next-auth/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/router";
import NavContent from "./NavContent";
import { useGetCurrentUserQuery } from "@/client/features/user";

const Nav = () => {
  const router = useRouter();
  const user = useGetCurrentUserQuery();
  return user.data ? (
    <>
      <nav className="mx-auto flex h-full w-11/12 items-center lg:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="w-[18rem]">
            <SheetHeader>
              <SheetTitle className="h-20">
                <div className="relative flex h-full w-20 items-center justify-center ">
                  {/* <Image /> */}
                  Logo
                </div>
              </SheetTitle>
            </SheetHeader>
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="relative flex h-full w-20 items-center justify-center">
          {/* <Image /> */}
          Logo
        </div>
        <ModeToggle />
        <Menubar className="ml-auto mr-4 rounded-full  border-0 p-0">
          <MenubarMenu>
            <MenubarTrigger className="flex  w-full gap-3 rounded-full py-0 pl-4 pr-0">
              <span className="hidden sm:block">

              {user.data.name ?? user.data.email}
              </span>
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent className="mr-12">
              <MenubarItem
                className="flex gap-3"
                onClick={() =>
                  void router.push(
                    `/profile?id=${user.data?.id}&role=${user.data?.role}`
                  )
                }
              >
                <User size={15} />
                Profile
              </MenubarItem>
              <MenubarSeparator />

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
              <MenubarItem
                className="flex gap-2"
                onClick={() => {
                  signOut()
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err));
                }}
              >
                <LogOut size={15} />
                <Button variant="ghost" size="sm" className="px-0 font-normal">
                  Sign out
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>
      <nav className="hidden max-h-screen w-full lg:sticky lg:bottom-0 lg:top-0 lg:flex lg:flex-col">
        <div className="relative flex h-20 w-full items-center justify-start">
          {/* <Image /> */}
          Logo
        </div>
        <NavContent />
        <Menubar className="mb-16 mr-auto mt-auto w-full rounded-full border-0 p-0">
          <MenubarMenu>
            <MenubarTrigger className="flex w-full gap-3 rounded-full py-0 pl-0">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {user.data.name ?? user.data.email}
            </MenubarTrigger>
            <MenubarContent className="mr-12">
              <MenubarItem
                className="flex gap-3"
                onClick={() =>
                  void router.push(
                    `/profile?id=${user.data?.id}&role=${user.data?.role}`
                  )
                }
              >
                <User size={15} />
                Profile
              </MenubarItem>
              <MenubarSeparator />

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
              <MenubarItem
                className="flex gap-2"
                onClick={() => {
                  signOut()
                    .then(() => {
                      toast({ title: "Sign out successfully" });
                      void router.push("/");
                    })
                    .catch((err) => console.log(err));
                }}
              >
                <LogOut size={15} />
                <Button variant="ghost" size="sm" className="px-0 font-normal">
                  Sign out
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>
    </>
  ) : null;
};

export default Nav;
