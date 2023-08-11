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

const AccountDrawer = dynamic(
  () => import("@/client/features/user/components/auth/AccountDrawer"),
  {
    ssr: false,
    loading: () => <div>loading</div>,
  }
);

const Auth = () => {


  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="relative -z-10 min-h-screen w-full">
        {/* <Image src={helper.auth} alt="auth" fill priority={true} /> */}
      </div>
      <div className="absolute flex min-h-screen w-full items-center justify-center">
        <div className="grid h-auto w-full min-w-[20rem] max-w-[70rem] grid-cols-1 overflow-hidden rounded-md shadow-md md:grid-cols-5 lg:h-[50rem] lg:min-w-[50rem]">
          <div className="relative col-span-2">{/* <Image /> */}</div>
          <div className="col-span-3 h-full px-8 py-16">
            <div className="flex w-full items-center justify-between">
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
                <SignUp />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
