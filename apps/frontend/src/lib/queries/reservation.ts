import { tuyau } from '~/lib/tuyau'
import { InferResponseType } from '@tuyau/react-query'
import { toast } from 'sonner'

export type Reservation = InferResponseType<typeof tuyau.reservations.$post>

export const createReservationMutationOptions =
  tuyau.reservations.$post.mutationOptions({
    onSuccess: () => {
      toast.success('Réservation créée avec succès !')
    },
  })
