import { Button } from "@/client/components/ui/button";
import { ModeToggle } from "@/client/components/ModeToggle";
import { Text } from "@/client/components/ui/text";
import { authOptions } from "@/server/auth";
import { signOut } from "next-auth/react";
import { type Session, getServerSession } from "next-auth";
import { type GetServerSidePropsContext } from "next";
import { api } from "@/utils/api";
import React from 'react';

export default function Home({ session }: { session: Session }) {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );
  const [id, setId] = React.useState<string>("")
  const getAll = api.device.getAll.useQuery();
  const start = api.device.start.useMutation();
  const pause = api.device.pause.useMutation();
  const remove = api.device.remove.useMutation();
  const getByDevice = api.log.getByDevice.useQuery({ deviceId: id }, { enabled: !!id } );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="p-8">
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

      <ModeToggle />

      <button
        onClick={() => {
          signOut()
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }}
      >
        Sign out
      </button>
    </main>
  );
}

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/auth",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       session,
//     },
//   };
// };
