import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Destination } from "../backend.d";

export function useGetAllDestinations() {
  const { actor, isFetching } = useActor();
  return useQuery<Destination[]>({
    queryKey: ["destinations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDestinations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscribeNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribeNewsletter(email);
    },
  });
}

export function useInitialize() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["initialize"],
    queryFn: async () => {
      if (!actor) return null;
      await actor.initialize();
      return true;
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}
