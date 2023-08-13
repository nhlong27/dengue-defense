import React from "react";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";

const Nav = dynamic(() => import("./Nav"), {
  loading: () => (
    <>
      <nav className="mx-auto hidden h-full w-full lg:flex">
        <Skeleton className="h-full w-full" />
      </nav>
    </>
  ),
  ssr: false,
});

const Sidebar = () => {
  return (
    <div className="hidden w-[18rem] border-r px-8 lg:flex ">
      <Nav />
    </div>
  );
};

export default Sidebar;
