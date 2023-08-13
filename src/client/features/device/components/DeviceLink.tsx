import { Button } from "@/client/components/ui/button";
import { FolderOpenDot } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { useGetCurrentUserQuery } from "../../user";

const DeviceLink = ({ id, ownerId }: { id: string; ownerId: string }) => {
  const router = useRouter();
  const user = useGetCurrentUserQuery();
  return (
    <Button
      variant='secondary'
      disabled={ownerId !== user.data?.id}
      onClick={() => {
        void router.push(`/devices/${id}`);
      }}
      className="flex items-center w-3/4 ml-auto justify-between pl-3 font-medium gap-2"
    >
      <FolderOpenDot size={20} /> {id}
    </Button>
  );
};

export default DeviceLink;
