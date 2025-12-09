import { useMutation, useQuery } from '@tanstack/react-query'
import { InferResponseType } from '@tuyau/react-query'
import { queryClient, tuyau } from '~/lib/tuyau'
import {
  getCurrentUserQueryOptions,
  logoutMutationOptions,
} from '~/lib/queries/auth'
import { useEffect } from 'react'
import { router } from '~/lib/router'

export type User = InferResponseType<typeof tuyau.auth.me.$get>

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

  useEffect(() => {
    void router.invalidate()
  }, [userQuery.data])

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
