import { Button } from "@/client/components/ui/button";
import { ModeToggle } from "@/client/components/ModeToggle";
import { Text } from "@/client/components/ui/text";
import { getServerSession } from "next-auth";
import { type GetServerSidePropsContext } from "next";
import { api } from "@/utils/api";
import React from "react";
import { authOptionsWrapper } from "./api/auth/[...nextauth]";
import Header from "@/client/components/layout/Header";
import Sidebar from "@/client/components/layout/Sidebar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import OAuthModal from "@/client/components/OAuthModal";
import { Profile, Users, useGetCurrentUserQuery } from "@/client/features/user";
import { DeviceDetail, Devices, Logs } from "@/client/features/device";
import { Dashboard } from "@/client/features/dashboard/intex";
import BreadCrumbs from "@/client/components/BreadCrumbs";
import { Undo2 } from "lucide-react";

export default function Home() {
  const [id, setId] = React.useState<string>("");
  // const getAll = api.device.getAll.useQuery();
  // const start = api.device.start.useMutation();
  // const pause = api.device.pause.useMutation();
  // const remove = api.device.remove.useMutation();
  // const getByDevice = api.log.getByDevice.useQuery(
  //   { deviceId: id },
  //   { enabled: !!id }
  // );

  const router = useRouter();
  const { data: session } = useSession();
  const { data } = api.user.checkIfOAuth.useQuery(
    { email: session?.user?.email ?? "" },
    { enabled: !!session?.user?.email }
  );
  console.log(router);
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
        <div className="flex flex-grow flex-col py-4 sm:pl-8 sm:pr-16 px-4">
          <div className="flex justify-start gap-4">
            <button onClick={()=>{
              router.back()
            }} className="mb-4 rounded-lg border bg-muted px-3 py-1 text-sm font-medium">
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
  const session = await getServerSession(
    //@ts-ignore
    ...authOptionsWrapper(context.req, context.res)
  );

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
