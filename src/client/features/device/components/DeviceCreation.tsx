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
import { Label } from "@/client/components/ui/label";
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
import { useRouter } from "next/router";

const addDeviceSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  patient: z.string().optional(),
});

export function DeviceCreation() {
  const form = useForm<z.infer<typeof addDeviceSchema>>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      title: "",
      patient: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const createDevice = api.device.create.useMutation();
  const onSubmit = (data: z.infer<typeof addDeviceSchema>) => {
    setIsSubmitting(true);
    console.log(data);
    createDevice.mutate(
      {
        title: data.title,
        patient: data.patient ?? undefined,
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

          setIsSubmitting(false);
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Create device failed",
            description: "Check console for error message",
            variant: "destructive",
          });
          setIsSubmitting(false);
        },
        onSettled: () => {
          setIsDone(true);
        },
      }
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-8">
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

            {/* <Select>
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
            </Select> */}
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
            <FormField
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
            />
            <DialogFooter>
              {isDone ? (
                <DialogTrigger asChild>
                  <Button className="flex gap-2">Finish</Button>
                </DialogTrigger>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex gap-2"
                >
                  Save changes
                  {isSubmitting && (
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
  );
}
