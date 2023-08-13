import { ModeToggle } from "@/client/components/ModeToggle";
import { type AuthOptions, getServerSession } from "next-auth";
import {
  type NextApiRequest,
  type GetServerSidePropsContext,
  type NextApiResponse,
} from "next";
import { api } from "@/utils/api";
import React from "react";
import { authOptionsWrapper } from "./api/auth/[...nextauth]";
import Header from "@/client/components/layout/Header";
import Sidebar from "@/client/components/layout/Sidebar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import OAuthModal from "@/client/components/OAuthModal";
import { Profile, Users } from "@/client/features/user";
import { DeviceDetail, Devices, Logs } from "@/client/features/device";
import { Dashboard } from "@/client/features/dashboard/intex";
import BreadCrumbs from "@/client/components/BreadCrumbs";
import { Undo2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data } = api.user.checkIfOAuth.useQuery(
    { email: session?.user?.email ?? "" },
    { enabled: !!session?.user?.email }
  );
  return (
    <main className="mx-auto flex min-h-screen w-full min-w-[280px] max-w-[2000px] flex-col lg:flex-row">
      {data && <OAuthModal isOAuthUser={data} />}
      <Header />
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:order-2 lg:grow ">
        <div className="hidden h-16 w-full items-center justify-start px-8 shadow-sm lg:flex">
          <h1 className="mr-auto text-2xl font-semibold capitalize tracking-wide">
            {router.query.slug?.[0] ? router.query.slug?.[0] : "Dashboard"}
          </h1>
          <ModeToggle />
        </div>
        <div className="flex flex-grow flex-col px-4 py-4 sm:pl-8 sm:pr-16">
          <div className="flex justify-start gap-4">
            <button
              onClick={() => {
                router.back();
              }}
              className="mb-4 rounded-lg border bg-muted px-3 py-1 text-sm font-medium"
            >
              <Undo2 size={15} />
            </button>
            <BreadCrumbs routerQueries={[...(router.query.slug ?? [])]} />
          </div>
          {(() => {
            if (router.query.slug?.[1]) {
              return <DeviceDetail id={router.query.slug?.[1]} />;
            }
            switch (router.query.slug?.[0]) {
              case "profile":
                return <Profile />;
              case "users":
                return <Users />;
              case "devices":
                return <Devices />;
              case "logs":
                return <Logs deviceId={null} />;
              default:
                return <Dashboard />;
            }
          })()}
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const options: [NextApiRequest, NextApiResponse, AuthOptions] =
    authOptionsWrapper(
      context.req as NextApiRequest,
      context.res as NextApiResponse
    ) as [NextApiRequest, NextApiResponse, AuthOptions];
  const session = await getServerSession(...options);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
