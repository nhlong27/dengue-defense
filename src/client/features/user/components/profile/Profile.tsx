import { Skeleton } from "@/client/components/ui/skeleton";
import { api } from "@/utils/api";
import { Paperclip } from "lucide-react";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/client/components/ui/hover-card";
import { useRouter } from "next/router";

const Profile = () => {
  const router = useRouter();
  const user = api.user.getById.useQuery({id: router.query.id as string}, {enabled: !!router.query.id});
  
  return user ? (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-muted-foreground">
          User Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Personal details and responsibilities.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-muted-foreground">
              Full name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {user.data?.name ?? <Skeleton className="h-8 w-24" />}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-muted-foreground">
              Registered as
            </dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {user.data?.role ? (
                user.data?.role === "ADMIN" ? (
                  "Doctor"
                ) : (
                  "Patient"
                )
              ) : (
                <Skeleton className="h-8 w-24" />
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-muted-foreground">
              Email address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {user.data?.email ?? <Skeleton className="h-8 w-24" />}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-muted-foreground">
              Created at
            </dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
              {user.data?.createdAt ? (
                new Date(user.data?.createdAt).toLocaleDateString()
              ) : (
                <Skeleton className="h-8 w-24" />
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-muted-foreground">Bio</dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
            Please note that the exact device names and conducting methods of the remote monitoring system can vary based on local laws, regulations, and the specific context of the doctors&apos; practice. It&apos;s recommended that doctors work with legal professionals to their specific needs and ensure legal compliance.
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-muted-foreground">
              Regulations, License and Registration
            </dt>
            <dd className="mt-2 text-sm text-muted-foreground sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-gray-100 rounded-md border border-gray-200"
              >
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <Paperclip
                      className="h-5 w-5 flex-shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">
                        Medical_License_to_Practice Medicine.pdf
                      </span>
                      <span className="flex-shrink-0 text-muted-foreground">2.4mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                  <HoverCard>
                      <HoverCardTrigger className="font-medium text-primary hover:text-primary/70 cursor-pointer">
                        Download
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Feature in development
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </li>
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <Paperclip
                      className="h-5 w-5 flex-shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">
                        Remote_Medical_Consultation Agreement.pdf
                      </span>
                      <span className="flex-shrink-0 text-muted-foreground">4.5mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <HoverCard>
                      <HoverCardTrigger className="font-medium text-primary hover:text-primary/70 cursor-pointer">
                        Download
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Feature in development
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  ) : null
};

export default Profile;
