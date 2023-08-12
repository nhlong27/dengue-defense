import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { api } from "@/utils/api";

export default function Users() {
  const getAllUsers = api.user.getAll.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
  });

  return getAllUsers.data ? (
    <Tabs defaultValue="patient" className="w-full">
      <TabsList>
        <TabsTrigger value="patient">Patient</TabsTrigger>
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
      </TabsList>
      <TabsContent value="patient">
        <ul role="list" className="divide-y divide-gray-100">
          {getAllUsers.data
            .filter((person) => person.role === "USER")
            .map((person) => (
              <li
                key={person.email}
                className="flex justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold capitalize leading-6 text-gray-900">
                      {person.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {person.email}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </TabsContent>
      <TabsContent value="doctor">
        <ul role="list" className="divide-y divide-gray-100">
          {getAllUsers.data
            .filter((person) => person.role === "ADMIN")
            .map((person) => (
              <li
                key={person.email}
                className="flex justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold capitalize leading-6 text-gray-900">
                      {person.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {person.email}
                    </p>
                  </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </TabsContent>
    </Tabs>
  ) : null;
}
