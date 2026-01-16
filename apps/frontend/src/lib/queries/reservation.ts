import { queryClient, tuyau } from '~/lib/tuyau'
import { toast } from 'sonner'

export const createReservationMutationOptions =
  tuyau.reservations.$post.mutationOptions({
    onSuccess: (_data, _variables) => {
      toast.success('Réservation créée avec succès !')

      // Log all queries for debugging
      const allQueries = queryClient.getQueryCache().getAll()
      console.log('All queries:', allQueries.length)

      // Find matching queries
      const matchingQueries = allQueries.filter(query => {
        const key = query.queryKey
        const matches =
          Array.isArray(key) &&
          Array.isArray(key[0]) &&
          key[0].includes('sport-equipments') &&
          key[0].includes('reservations')
        if (matches) {
          console.log(
            'Found matching query:',
            key,
            'state:',
            query.state.status
          )
        }
        return matches
      })

      console.log('Matching queries count:', matchingQueries.length)

      // Refetch all equipment reservation queries
      void queryClient
        .refetchQueries({
          predicate: query => {
            const key = query.queryKey
            return (
              Array.isArray(key) &&
              Array.isArray(key[0]) &&
              key[0].includes('sport-equipments') &&
              key[0].includes('reservations')
            )
          },
        })
        .then(() => {
          console.log('Refetch completed')
        })
    },
  })
