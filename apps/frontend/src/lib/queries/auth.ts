import { queryClient, tuyau } from '~/lib/tuyau'
import { toast } from 'sonner'
import { router } from '~/lib/router'

export const getCurrentUserQueryOptions = tuyau.me.$get.queryOptions(
  {},
  {
    retry: false,
    throwOnError: false,
  }
)

export const loginMutationOptions = tuyau.login.$post.mutationOptions({
  onSuccess: async () => {
    void queryClient.invalidateQueries({
      queryKey: getCurrentUserQueryOptions.queryKey,
    })
    void router.invalidate()
  },
  onError: async error => {
    if (error instanceof Error) {
      toast.error('Identifiants incorrects', {
        description: 'Veuillez vérifier vos identifiants ou créer un compte',
      })
    } else {
      toast.error('Une erreur est survenue')
    }
  },
})

export const logoutMutationOptions = tuyau.logout.$post.mutationOptions({
  onSettled: () => {
    toast.success('Déconnexion réussie')
    void router.navigate({ to: '/auth/login' })
    queryClient.removeQueries({
      queryKey: getCurrentUserQueryOptions.queryKey,
    })
  },
})
