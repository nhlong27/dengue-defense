import React from "react";
import { Drawer } from "vaul";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Text } from "@/client/components/ui/text";
import { ScrollArea } from "@/client/components/ui/scroll-area";
import { Separator } from "@/client/components/ui/separator";

const AccountDrawer = () => {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="secondary" className="flex items-center gap-4">
          <AlertTriangle />
          <Text variant="default">
            Sign in with our{" "}
            <span className="text-accent-foreground">demo accounts</span>{" "}
            instead
          </Text>
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed left-0 right-0 top-0 mt-24 flex h-full flex-col rounded-t-[10px] bg-zinc-100">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-md">
              <Drawer.Title className="mb-4 font-medium">
                Demo accounts
              </Drawer.Title>
              <p className="mb-2 text-zinc-600">
                Choose one of these accounts to be used as a replacement for
                Signing In / Signing Up.
              </p>
              <ScrollArea className="h-[50rem] w-[28rem] rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Doctors
                  </h4>
                  {Array(5)
                    .fill(1)
                    .map((tag: string, i) => (
                      <React.Fragment key={i}>
                        <div className="text-sm">{tag}</div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                </div>
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    Patients
                  </h4>
                  {Array(5)
                    .fill(1)
                    .map((tag: string, i) => (
                      <React.Fragment key={i}>
                        <div className="text-sm">{tag}</div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default AccountDrawer;
