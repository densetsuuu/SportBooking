import { tuyau } from '~/lib/tuyau'
import { InferResponseType } from '@tuyau/react-query'

export type Reservation = InferResponseType<typeof tuyau.reservations.$post>

export const createReservationMutationOptions =
  tuyau.reservations.$post.mutationOptions
