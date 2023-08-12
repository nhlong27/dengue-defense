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
import { useSession } from "next-auth/react";

const UponAssignment = ({ device }: { device: Device }) => {
  const getUnassigned = api.user.getUnassigned.useQuery();
  const {data: session} = useSession();
  const getUser = api.user.get.useQuery(
    { email: session?.user?.email ?? "" },
    { enabled: !!session?.user?.email }
  );
  const [open, setOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Omit<
    User,
    "password"
  > | null>(null);
  return getUnassigned.data && getUser.data ? (
    <Popover open={open} onOpenChange={setOpen}>
      {selectedPatient ? (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={()=>{
              setSelectedPatient(null)
            }}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            // onClick={()=>{

            // }}
          >
            Save
          </Button>
        </div>
      ) : (
        <PopoverTrigger disabled={device.ownerId !== getUser.data.id && !device.active } asChild>
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
          <CommandInput placeholder="Assign to..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {getUnassigned.data.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={(value) => {
                    setSelectedPatient(
                      getUnassigned.data.find((user) => user.email === value) ??
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
