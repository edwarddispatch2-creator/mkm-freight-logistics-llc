import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContactSubmission } from "../backend";
import { useActor } from "./useActor";

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactSubmission[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      companyName: string;
      phone: string;
      email: string;
      numTrucks: string;
      serviceNeeded: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitContactForm(
        data.name,
        data.companyName,
        data.phone,
        data.email,
        data.numTrucks,
        data.serviceNeeded,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
