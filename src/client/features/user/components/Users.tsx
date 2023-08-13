import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { api } from "@/utils/api";
import { UserCircle2 } from "lucide-react";
import { Separator } from "@/client/components/ui/separator";
import { useRouter } from "next/router";
import { Button } from "@/client/components/ui/button";
import { useGetCurrentUserQuery } from "../hooks/useGetCurrentUserQuery";
import { toast } from "@/client/components/ui/use-toast";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/client/components/ui/badge";
import { RotatingLines } from "react-loader-spinner";
import Link from "next/link";

export default function Users() {
  const getAllUsers = api.user.getAll.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
  });
  const router = useRouter();
  const addToGroup = api.group.addToGroup.useMutation();
  const user = useGetCurrentUserQuery();
  const groupKey = getQueryKey(api.group.getByOwner, {
    ownerId: user.data?.id,
  });
  const usersKey = getQueryKey(api.user.getAll, undefined, "query");
  const queryClient = useQueryClient();
  return user.data && getAllUsers.data && router ? (
    <Tabs
      defaultValue={(router.query.role as string) ?? "patient"}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="patient">Patient</TabsTrigger>
        <TabsTrigger value="doctor">Doctor</TabsTrigger>
      </TabsList>
      <Separator className="mt-4" />
      <TabsContent value="patient">
        <ul role="list" className="divide-y divide-gray-100">
          {getAllUsers.data
            .filter((person) => person.role === "USER")
            .map((person) => (
              <li
                key={person.email}
                className="flex justify-start gap-x-6 py-2"
              >
                <div className="my-auto">
                  <Badge variant="outline" className="px-3 py-2">
                    Patient
                  </Badge>
                </div>
                <Link
                  href={`/profile?id=${person.id}`}
                  className="flex min-w-0 items-center gap-x-4"
                >
                  <UserCircle2 size={30} />

                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold capitalize leading-6 text-gray-900">
                      {person.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {person.email}
                    </p>
                  </div>
                </Link>
                {person.groupId ? (
                  <Button variant="secondary" className="ml-auto mr-4">
                    In group {person.groupId}
                  </Button>
                ) : user.data?.role === "ADMIN" ? (
                  <Button
                    variant="ghost"
                    className="ml-auto mr-4"
                    disabled={addToGroup.isLoading}
                    onClick={() => {
                      addToGroup.mutate(
                        {
                          userId: person.id,
                          ownerId: user.data!.id,
                        },
                        {
                          onSuccess: () => {
                            toast({
                              title: "Add to group successfully!",
                            });
                            void queryClient.invalidateQueries(groupKey);
                            void queryClient.invalidateQueries(usersKey);
                          },
                          onError: (error) => {
                            console.log(error);
                            toast({
                              title: "Command failed",
                              description: "Check console for error message",
                              variant: "destructive",
                            });
                          },
                        }
                      );
                    }}
                  >
                    Add to group
                    {addToGroup.isLoading && (
                      <RotatingLines
                        strokeColor="#422006"
                        strokeWidth="5"
                        width="20"
                      />
                    )}
                  </Button>
                ) : (
                  <div className="hidden sm:block ml-auto mr-4 text-sm text-muted-foreground">
                    You don&apos;t have permission to add
                  </div>
                )}
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
                className="flex justify-start gap-x-6 py-2"
              >
                <div className="my-auto">
                  <Badge className="px-3 py-2">Doctor</Badge>
                </div>
                <Link
                  href={`/profile?id=${person.id}`} className="flex min-w-0 items-center gap-x-4">
                  <UserCircle2 size={30} />

                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold capitalize leading-6 text-gray-900">
                      {person.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {person.email}
                    </p>
                  </div>
                </Link>

                <div className="ml-auto hidden shrink-0 sm:flex sm:flex-col sm:items-end">
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
