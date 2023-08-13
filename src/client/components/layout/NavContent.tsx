import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import {
  Home,
  MonitorSmartphone,
  ScrollText,
  UserSquare2,
  Users,
} from "lucide-react";
import { api } from "@/utils/api";
import { useGetCurrentUserQuery } from "@/client/features/user";
import { ScrollArea } from "../ui/scroll-area";

const NavContent = () => {
  const router = useRouter();
  const user = useGetCurrentUserQuery();
  const log = api.user.getLastLog.useQuery(
    {
      userId: user.data?.id,
    },
    {
      enabled: !!user.data?.id,
    }
  );
  const group = api.group.getByOwner.useQuery(
    {
      ownerId: user.data?.id,
    },
    {
      enabled: !!user.data?.id,
    }
  );
  const patientsOfGroup = api.user.getByGroupId.useQuery(
    {
      groupId: group.data?.id.toString(),
    },
    {
      enabled: !!group.data?.id,
    }
  );
  return patientsOfGroup ? (
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
      <p className="mb-4 mt-12 text-sm font-bold text-stone-300">
        Your {user.data?.id === "ADMIN" ? "group" : "data"}
      </p>
      <div className="flex w-full flex-col gap-1">
        {user.data?.role === "ADMIN" ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                void router.push({
                  pathname: "/users",
                  query: {
                    role: "patient",
                  },
                });
              }}
            >
              Add patient
            </Button>
            <ScrollArea className="h-[10rem]">
              {patientsOfGroup.data?.map((patient) => (
                <Button
                  key={patient.id}
                  onClick={() => {
                    void router.push(`/profile?id=${patient.id}`);
                  }}
                  variant="ghost"
                  size="lg"
                  className={`flex w-full items-center justify-start gap-3 ${
                    router.query.slug?.[0] === "group" ? "bg-accent" : ""
                  }`}
                >
                  <UserSquare2 size={20} /> {patient.email}
                </Button>
              ))}
            </ScrollArea>
          </>
        ) : (
          <div className="flex gap-4 px-8">
            Group ID
            <span className="text-muted-foreground">
              {user.data?.groupId ?? "N/A"}
            </span>
          </div>
        )}
      </div>
      {user.data?.role === "USER" && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex w-full items-center justify-between rounded-lg border px-6 py-3 text-sm text-orange-500 dark:text-orange-300">
            Temperature
            <span className="text-base">{log.data?.temp ?? "N/A"}</span>
          </div>
          <div className="flex w-full items-center justify-between rounded-lg border px-6 py-3 text-sm text-green-500 dark:text-green-300">
            SpO2
            <span className="text-base ">{log.data?.spo2 ?? "N/A"}</span>
          </div>
          <div className="flex w-full items-center justify-between rounded-lg border px-6 py-3 text-sm text-purple-500 dark:text-purple-300">
            Heart Pressure
            <span className="text-base ">{log.data?.HP ?? "N/A"}</span>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default NavContent;
