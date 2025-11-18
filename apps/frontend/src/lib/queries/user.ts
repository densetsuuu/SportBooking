import { queryClient, tuyau } from '../tuyau'
import { InferResponseType } from '@tuyau/react-query'
import { router } from '~/lib/router'
import { toast } from 'sonner'
import { getCurrentUserQueryOptions } from '~/lib/queries/auth'

const _getUser = tuyau.users({ userId: 0 }).$get
export type SocialAccount = InferResponseType<
  typeof _getUser
>['socialAccounts'][number]

export const usersQueries = {
  get: (userId: string) =>
    tuyau.users({ userId }).$get.queryOptions({
      params: {
        userId,
      },
    }),
  delete: (userId: string) =>
    tuyau.users({ userId }).$delete.mutationOptions({
      onSuccess: async () => {
        queryClient.removeQueries({
          queryKey: getCurrentUserQueryOptions.queryKey,
        })
        void router.navigate({ to: '/register', replace: true })
        toast.success('Compte supprimé avec succès')
      },
    }),
}
