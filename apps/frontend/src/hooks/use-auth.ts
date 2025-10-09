import { useMutation, useQuery } from "@tanstack/react-query";
import { InferResponseType } from "@tuyau/react-query";
import { queryClient, tuyau } from "~/lib/tuyau";
import { z } from "zod";
import { loginFormSchema } from "~/lib/schemas/auth";
import { getCurrentUserQueryOptions } from "~/lib/queries/user";
import {
  loginMutationOptions,
  logoutMutationOptions,
} from "~/lib/queries/auth";
import { router } from "~/lib/router";

export type User = InferResponseType<typeof tuyau.me.$get>;

type AuthUtils = {
  signIn: (data: z.infer<typeof loginFormSchema>, redirectTo?: string) => void;
  signOut: () => void;
  ensureData: () => Promise<User | undefined>;
};

type AuthData = {
  user: User;
  isPending?: boolean;
} & AuthUtils;

function useAuth(): AuthData {
  const userQuery = useQuery(getCurrentUserQueryOptions);
  const loginMutation = useMutation(loginMutationOptions);
  const signOutMutation = useMutation(logoutMutationOptions);

  const utils: AuthUtils = {
    signIn: (data: z.infer<typeof loginFormSchema>, redirectTo?: string) => {
      void loginMutation.mutateAsync(
        {
          payload: { email: data.email, password: data.password },
        },
        {
          onSuccess: () => {
            void router.navigate({ to: redirectTo || "/", replace: true });
          },
        },
      );
    },
    signOut: () => {
      void signOutMutation.mutateAsync({});
    },
    ensureData: async () => {
      try {
        return await queryClient.ensureQueryData(getCurrentUserQueryOptions);
      } catch {
        return undefined;
      }
    },
  };

  return {
    ...utils,
    user: userQuery.data!,
    isPending: userQuery.isFetching || loginMutation.isPending,
  };
}

export { useAuth };
export type { AuthData };