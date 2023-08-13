import React from "react";
import { Drawer } from "vaul";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Text } from "@/client/components/ui/text";
import { ScrollArea } from "@/client/components/ui/scroll-area";
import { Separator } from "@/client/components/ui/separator";
import { api } from "@/utils/api";

const AccountDrawer = () => {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <div className="flex items-center gap-4 bg-muted px-4 py-2 rounded-md h-auto">
          <AlertTriangle size={20} />
          <Text variant="default" className="">
            Sign in with our{" "}
            <span className="text-accent-foreground">demo accounts</span>{" "}
            instead
          </Text>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0" />
        <Drawer.Content className="fixed left-0 right-0 top-0 mt-24 flex h-full flex-col rounded-t-[10px] bg-white dark:bg-stone-900">
          <div className="flex-1 rounded-t-[10px]  p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 text-2xl font-medium">
                Demo accounts
              </Drawer.Title>
              <p className="mb-2 text-muted-foreground">
                Choose one of these accounts to be used as a replacement for
                Signing In / Signing Up.
              </p>
              <div className="grid h-auto max-w-[28rem] min-w-[450px] rounded-md border overflow-x-scroll">
                <div className="grid grid-cols-3 p-4 place-items-center">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Email
                  </h4>
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Password
                  </h4>
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Role
                  </h4>
                </div>
                <Separator className="" />
                <div className="grid grid-cols-3 p-4 place-items-center ">
                  <div className="font-medium text-green-500 dark:text-green-300">
                    patient1@mail.com
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    patient1
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    PATIENT
                  </div>
                </div>
                <div className="grid grid-cols-3 p-4 place-items-center">
                  <div className="font-medium text-green-500 dark:text-green-300">
                    patient2@mail.com
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    patient2
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    PATIENT
                  </div>
                </div>
                <div className="grid grid-cols-3 p-4 place-items-center">
                  <div className="font-medium text-green-500 dark:text-green-300">
                    doctor1@mail.com
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    doctor1
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    DOCTOR
                  </div>
                </div>
                <div className="grid grid-cols-3 p-4 place-items-center">
                  <div className="font-medium text-green-500 dark:text-green-300">
                    doctor2@mail.com
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    doctor2
                  </div>
                  <div className="font-medium text-green-500 dark:text-green-300">
                    DOCTOR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default AccountDrawer;
