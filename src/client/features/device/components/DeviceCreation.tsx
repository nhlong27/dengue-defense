import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import { api } from "@/utils/api";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/client/components/ui/use-toast";
import React from "react";
import { RotatingLines } from "react-loader-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { useGetCurrentUserQuery } from "../../user";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/client/components/ui/command";
import { User } from "@prisma/client";

const addDeviceSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
});

export function DeviceCreation() {
  const form = useForm<z.infer<typeof addDeviceSchema>>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      title: "",
    },
  });
  const [isDone, setIsDone] = React.useState(false);
  const createDevice = api.device.create.useMutation();
  const getUser = useGetCurrentUserQuery();
  const deviceGetAllKey = getQueryKey(api.device.getAll, undefined, "query");
  const queryClient = useQueryClient();
  const getUnassigned = api.user.getUnassigned.useQuery();
  const [selectedPatient, setSelectedPatient] = React.useState<Omit<
    User,
    "password"
  > | null>(null);
  const [open, setOpen] = React.useState(false);

  const onSubmit = (data: z.infer<typeof addDeviceSchema>) => {
    if (getUser.data) {
      createDevice.mutate(
        {
          title: data.title,
          ownerId: getUser.data.id,
          patient: selectedPatient ? selectedPatient.id : null,
        },
        {
          onSuccess: (response) => {
            toast({
              title: "Create device successfully!",
              description: (
                <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <p className="text-white">
                    Your device name is <strong>{response.title}</strong>
                  </p>
                </div>
              ),
            });
            void queryClient.invalidateQueries(deviceGetAllKey);
          },
          onError: (error) => {
            console.log(error);
            toast({
              title: "Create device failed",
              description: "Check console for error message",
              variant: "destructive",
            });
          },
          onSettled: () => {
            setSelectedPatient(null);
            setIsDone(true);
          },
        }
      );
    }
  };
  console.log(selectedPatient)
  return getUnassigned ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={getUser.data?.role!=='ADMIN'} variant="default" className="ml-8">
          Add a device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader className="mb-4">
              <DialogTitle>Device Creation</DialogTitle>
              <DialogDescription>
                Fill in all the necessary information for the device below.
              </DialogDescription>
            </DialogHeader>

            <Select>
              <FormLabel>Model</FormLabel>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="3-Multi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">3-Multi</SelectItem>
                <SelectItem disabled={true} value="dark">
                  XHL-Temp (Out of order)
                </SelectItem>
                <SelectItem disabled={true} value="system">
                  Bio-2D (Out of order)
                </SelectItem>
              </SelectContent>
            </Select>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Device name</FormLabel>
                  <FormControl>
                    <Input placeholder="Very Real Device" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Assigned to patient ID</FormLabel>
                  <FormControl>
                    <Input placeholder="patient_A_ID" {...field} />
                  </FormControl>
                  <FormDescription>
                    Note: you can do this later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger  asChild>
                <div className="flex gap-4 text-sm text-muted-foreground items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="justify-start bg-primary/30 text-secondary-foreground"
                >
                  Assign to
                </Button>
                {open ? 'You can add this later.' : selectedPatient?.email}
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="Unassigned patients:" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {getUnassigned.data?.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={(value) => {
                            setSelectedPatient(
                              getUnassigned.data?.find(
                                (user) => user.email === value
                              ) ?? null
                            );
                            setOpen(false);
                          }}
                        >
                          <span>{user.email}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <DialogFooter>
              {isDone ? (
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setIsDone(false)}
                    className="flex gap-2"
                  >
                    Finish
                  </Button>
                </DialogTrigger>
              ) : (
                <Button
                  type="submit"
                  disabled={createDevice.isLoading}
                  className="flex gap-2"
                >
                  Save changes
                  {createDevice.isLoading && (
                    <RotatingLines
                      strokeColor="#422006"
                      strokeWidth="5"
                      width="20"
                    />
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  ) : null;
}
