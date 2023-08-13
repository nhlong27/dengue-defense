import React from "react";
import { useGetCurrentUserQuery } from "../../user";

const BelongsTo = ({ ownerId }: { ownerId: string }) => {
  const getUser = useGetCurrentUserQuery();
  return getUser.data ? (
    <div
      className={`text-center font-medium ${
        ownerId === getUser.data.id && "text-green-500 dark:text-green-300"
      }`}
    >
      {ownerId === getUser.data.id ? "You" : ownerId}
    </div>
  ) : null;
};

export default BelongsTo;
