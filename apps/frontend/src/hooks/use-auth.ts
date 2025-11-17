import { useMutation, useQuery } from '@tanstack/react-query'
import { InferResponseType } from '@tuyau/react-query'
import { queryClient, tuyau } from '~/lib/tuyau'
import {
  getCurrentUserQueryOptions,
  logoutMutationOptions,
} from '~/lib/queries/auth'

export type User = InferResponseType<typeof tuyau.me.$get>

type AuthUtils = {
  signOut: () => void
  ensureData: () => Promise<User | undefined>
}

type AuthData = {
  user: User
  isPending?: boolean
} & AuthUtils

function useAuth(): AuthData {
  const userQuery = useQuery(getCurrentUserQueryOptions)
  const signOutMutation = useMutation(logoutMutationOptions)

  const utils: AuthUtils = {
    signOut: () => {
      void signOutMutation.mutateAsync({})
    },
    ensureData: async () => {
      try {
        return await queryClient.ensureQueryData(getCurrentUserQueryOptions)
      } catch {
        return undefined
      }
    },
  }

  return {
    ...utils,
    user: userQuery.data!,
    isPending: userQuery.isFetching,
  }
}

export { useAuth }
export type { AuthData }
