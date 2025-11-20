import { queryClient, tuyau } from '~/lib/tuyau'
import { toast } from 'sonner'
import { router } from '~/lib/router'

export const getCurrentUserQueryOptions = tuyau.auth.me.$get.queryOptions(
  {},
  {
    retry: false,
    throwOnError: false,
  }
)

export const loginMutationOptions = (redirectTo?: string) =>
  tuyau.auth.login.$post.mutationOptions({
    onSuccess: async () => {
      void queryClient.invalidateQueries({
        queryKey: getCurrentUserQueryOptions.queryKey,
      })
      void router.navigate({ to: redirectTo || '/', replace: true })
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

export const logoutMutationOptions = tuyau.auth.logout.$post.mutationOptions({
  onSettled: () => {
    toast.success('Déconnexion réussie')
    void router.navigate({ to: '/login' })
    queryClient.removeQueries({
      queryKey: getCurrentUserQueryOptions.queryKey,
    })
  },
})

export const registerMutationOptions =
  tuyau.auth.register.$post.mutationOptions({
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getCurrentUserQueryOptions.queryKey,
      })
      void router.navigate({ to: '/', replace: true })
      toast.success('Compte créé avec succès')
    },
  })

export const disconnectSocialProviderMutationOptions = tuyau.auth.social[
  ':provider'
].$delete.mutationOptions({
  onSuccess: () => {
    void queryClient.invalidateQueries({
      queryKey: getCurrentUserQueryOptions.queryKey,
    })
    toast.success('Compte déconnecté avec succès')
  },
})
