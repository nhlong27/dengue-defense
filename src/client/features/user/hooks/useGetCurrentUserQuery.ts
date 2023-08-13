import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export const useGetCurrentUserQuery = () => {
  const {data: session} = useSession()
  const { data } = api.user.get.useQuery(
    { email: session?.user?.email ?? "" },
    { enabled: !!session?.user?.email }
  );
  return {data}
}