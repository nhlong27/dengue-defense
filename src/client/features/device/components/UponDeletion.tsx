import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
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
import { api } from "@/utils/api";
import { type Device } from "./Devices";

const UponDeletion = ({ device }: { device: Device }) => {
  const { data: session } = useSession();
  const getUser = api.user.get.useQuery(
    { email: session?.user?.email ?? "" },
    { enabled: !!session?.user?.email }
  );
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
          <DropdownMenuItem>View device logs</DropdownMenuItem>
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
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/70">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;
};

export default UponDeletion;
