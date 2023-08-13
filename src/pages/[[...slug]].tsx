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
  const {data: session} = useSession()
  const { data } = api.user.checkIfOAuth.useQuery(
    { email: session?.user?.email ?? "" },
    { enabled: !!session?.user?.email }
  );

  return (
    <main className="mx-auto flex min-h-screen w-full min-w-[300px] max-w-[2000px] flex-col lg:flex-row">
      {data && <OAuthModal isOAuthUser={data} />}
      {/* <div className="p-8">
        {getAll.data?.map((device) => (
          <div key={device.id}>
            <Text>id {device.id}</Text>
            <Text>title {device.title}</Text>
            <Text>active {device.active}</Text>
            <div className="flex gap-4">

            <button
              onClick={() => {
                start.mutate({ deviceId: "123" });
              }}
            >
              Start
            </button>
            <button
              onClick={() => {
                pause.mutate({ deviceId: "123" });
              }}
            >
              Pause
            </button>
            <button
              onClick={() => {
                remove.mutate({ deviceId: "123" });
              }}
            >
              Remove
            </button>
            <button
              onClick={() => {
                setId(device.id.toString())
              }}
            >
              Show logs
            </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-8 flex flex-col gap-3">
        {getByDevice.data?.map((log) => (
          <div key={log.id} className="flex gap-2 w-[50rem] h-8">
            <Text>id {log.id}</Text>
            <Text>deviceId {log.deviceId}</Text>
            <Text>time {log.temp}</Text>
            <Text>value {log.spo2}</Text>
            <Text>value {log.HP}</Text>
          </div>
        ))}
      </div>

      

      <button
        onClick={() => {
          signOut()
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }}
      >
        Sign out
      </button> */}
      <Header />
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:order-2 lg:grow ">
        <div className="hidden h-16 w-full items-center justify-between px-8 shadow-sm lg:flex">
          <h1 className="text-2xl font-semibold capitalize tracking-wide">
            {router.query.slug?.[0] ? router.query.slug?.[0] : "Dashboard"}
          </h1>
          <ModeToggle />
        </div>
        <div className="flex flex-grow flex-col pl-8 py-8 pr-16">
          {(() => {
            if (router.query.slug?.[1]) {
              return <DeviceDetail id={router.query.slug?.[1]} />
            } 
            switch (router.query.slug?.[0]) {
              case "profile":
                return <Profile />;
              case "users":
                return <Users />;
              case "devices":
                return <Devices />;
              case "logs":
                return <Logs />;
              default:
                return <Dashboard />
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
