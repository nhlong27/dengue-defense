// import { helper } from "@/utils/helper";
import Image from "next/image";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { SignIn, SignInWithProviders, SignUp } from "@/client/features/user";
import { Separator } from "@/client/components/ui/separator";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptionsWrapper } from "./api/auth/[...nextauth]";
import { type GetServerSidePropsContext } from "next";
import { helper } from "@/utils/helper";

const AccountDrawer = dynamic(
  () => import("@/client/features/user/components/auth/AccountDrawer"),
  {
    ssr: false,
    loading: () => <div>loading</div>,
  }
);

const Auth = () => {
  const [shouldSignUpAsDoctor, setShouldSignUpAsDoctor] = React.useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative -z-10 h-[50rem] min-h-screen w-full">
        <Image
          src={helper.auth}
          alt="auth"
          fill
          priority={true}
          className="object-cover brightness-50"
        />
      </div>
      <div className="absolute flex min-h-screen w-full items-center justify-center">
        <div className="grid h-auto w-full min-w-[20rem] max-w-[70rem] grid-cols-1 overflow-hidden rounded-md shadow-md md:grid-cols-5">
          <div className="relative col-span-2  overflow-hidden rounded-lg">
            <Image
              src={shouldSignUpAsDoctor ? helper.doctor : helper.patient}
              alt="auth"
              fill
              priority={true}
              className="object-cover transition-all duration-1000 hover:scale-110"
            />
          </div>
          <div className="col-span-3 h-full px-8">
            <div className="flex w-full items-center justify-between flex-col lg:flex-row gap-3">
              <AccountDrawer />
              <SignInWithProviders />
            </div>
            <Separator />
            <Tabs defaultValue="sign-in" className="mt-4 h-full w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in">
                <SignIn />
              </TabsContent>
              <TabsContent value="sign-up">
                <SignUp
                  shouldSignUpAsDoctor={shouldSignUpAsDoctor}
                  setShouldSignUpAsDoctor={setShouldSignUpAsDoctor}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  //@ts-ignore
  const session = await getServerSession(
    ...authOptionsWrapper(context.req, context.res)
  );

  if (session) {
    return {
      redirect: {
        destination: "/",
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
