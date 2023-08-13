import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import { Button } from "@/client/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/client/components/ui/command";
import { api } from "@/utils/api";
import { type Device } from "./Devices";
import { type User } from "@prisma/client";
import { useGetCurrentUserQuery } from "../../user";
import { toast } from "@/client/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { RotatingLines } from "react-loader-spinner";

const UponAssignment = ({ device }: { device: Device }) => {
  const getUnassigned = api.user.getUnassigned.useQuery();
  const getUser = useGetCurrentUserQuery();
  const [open, setOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Omit<
    User,
    "password"
  > | null>(null);
  const deviceKey = getQueryKey(api.device.get, {
    deviceId: device.id.toString(),
  });
  const queryClient = useQueryClient();
  const assignDevice = api.device.assign.useMutation();
  return getUnassigned.data && getUser.data ? (
    <Popover open={open} onOpenChange={setOpen}>
      {selectedPatient ? (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedPatient(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!selectedPatient || assignDevice.isLoading}
            className="flex gap-2"
            onClick={() => {
              if (selectedPatient) {
                assignDevice.mutate(
                  {
                    deviceId: device.id.toString(),
                    patientId: selectedPatient.id.toString(),
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Updated device!",
                      });
                      void queryClient.invalidateQueries(deviceKey);
                      setSelectedPatient(null);
                    },
                    onError: (error) => {
                      console.log(error);
                      toast({
                        title: "Command failed",
                        description: "Check console for error message",
                        variant: "destructive",
                      });
                      setSelectedPatient(null);

                    },
                  }
                );
              }
            }}
          >
            Save
            {assignDevice.isLoading && (
              <RotatingLines strokeColor="#422006" strokeWidth="5" width="20" />
            )}
          </Button>
        </div>
      ) : (
        <PopoverTrigger
          disabled={device.ownerId !== getUser.data.id || device.active || !!device.patient}
          asChild
        >
          <Button
            variant="outline"
            size="sm"
            className="justify-start bg-primary/30 text-secondary-foreground"
          >
            Assign
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder="Unassigned patients:" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {getUnassigned.data.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={(value) => {
                    setSelectedPatient(
                      getUnassigned.data?.find((user) => user.email === value) ??
                        null
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
  ) : null;
};

export default UponAssignment;
