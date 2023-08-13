import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/client/components/ui/alert-dialog";
import { Button } from "@/client/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { type Device } from "./Devices";
import { useGetCurrentUserQuery } from "../../user";
import { api } from "@/utils/api";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "@/client/components/ui/use-toast";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

const UponDeletion = ({ device }: { device: Device }) => {
  const getUser = useGetCurrentUserQuery();
  const removeDevice = api.device.remove.useMutation();
  const deviceGetAllKey = getQueryKey(api.device.getAll, undefined, "query");
  const queryClient = useQueryClient();
  const handleRemove = () => {
    removeDevice.mutate(
      { deviceId: device.id.toString() },
      {
        onSuccess: (response) => {
          toast({
            title: "Remove device successfully!",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-white">
                  Device {response.title} has been deleted.
                </p>
              </div>
            ),
          });
          void queryClient.invalidateQueries(deviceGetAllKey);
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Command failed",
            description: "Check console for error message",
            variant: "destructive",
          });
        },
      }
    );
  };
  return getUser.data ? (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!device.patient}
            onClick={() => void navigator.clipboard.writeText(device.patient)}
          >
            Copy patient ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={!device.ownerId}>
            View doctor
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!device.patient}>
            View patient
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/device/${device.id}`}>View device logs</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {device.ownerId === getUser.data?.id ? (
            <AlertDialogTrigger>
              <DropdownMenuItem className="bg-destructive-foreground text-destructive">
                Remove device
              </DropdownMenuItem>
            </AlertDialogTrigger>
          ) : (
            <DropdownMenuItem
              disabled={true}
              className="bg-destructive-foreground text-destructive"
            >
              Remove device
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            device from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={removeDevice.isLoading}
            onClick={handleRemove}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/70"
          >
            Remove
            {removeDevice.isLoading && (
              <RotatingLines strokeColor="#422006" strokeWidth="5" width="20" />
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
};

export default UponDeletion;
