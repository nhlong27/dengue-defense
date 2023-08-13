import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { Calendar, GanttChartSquare, Home, MonitorSmartphone, ScrollText, Users } from "lucide-react";

const NavContent = () => {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex w-full flex-col gap-1">
        <Button
          onClick={() => {
            void router.push("/");
          }}
          variant="ghost"
          size="lg"
          className={`flex w-full items-center justify-start gap-3 ${
            router.query.slug?.[0] ? "" : "bg-accent"
          }`}
        >
          <Home size={20} /> Dashboard
        </Button>
        <Button
          onClick={() => {
            void router.push("/users");
          }}
          variant="ghost"
          size="lg"
          className={`flex w-full items-center justify-start gap-3 ${
            router.query.slug?.[0] === "users" ? "bg-accent" : ""
          }`}
        >
          <Users size={20} /> Users
        </Button>
        <Button
          onClick={() => {
            void router.push("/devices");
          }}
          variant="ghost"
          size="lg"
          className={`flex w-full items-center justify-start gap-3 ${
            router.query.slug?.[0] === "devices" ? "bg-accent" : ""
          }`}
        >
          <MonitorSmartphone size={20} /> Devices
        </Button>
        <Button
          onClick={() => {
            void router.push("/logs");
          }}
          variant="ghost"
          size="lg"
          className={`flex w-full items-center justify-start gap-3 ${
            router.query.slug?.[0] === "logs" ? "bg-accent" : ""
          }`}
        >
          <ScrollText size={20} /> Logs
        </Button>
      </div>
      <p className="text-sm font-bold text-stone-300 mt-12 mb-4">Your groups</p>
      <div className="flex w-full flex-col gap-1">
        <Button
          onClick={() => {
            void router.push("/group/...");
          }}
          variant="ghost"
          size="lg"
          className={`flex w-full items-center justify-start gap-3 ${
            router.query.slug?.[0] === "group" ? "bg-accent" : ""
          }`}
        >
          <GanttChartSquare size={20} /> Group ...
        </Button>
      </div>
    </div>
  );
};

export default NavContent;
