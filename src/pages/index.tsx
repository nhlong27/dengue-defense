import { Button } from "@/client/components/ui/button";
import { ModeToggle } from "@/client/components/ModeToggle";
import { Text } from "@/client/components/ui/text";
import { authOptions } from "@/server/auth";
import { signOut } from "next-auth/react";
import { type Session, getServerSession } from "next-auth";
import { type GetServerSidePropsContext } from "next";

export default function Home({ session }: { session: Session }) {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <Button variant="default">
        <Text variant="default">Hello</Text>
      </Button>
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

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
