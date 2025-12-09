import { tuyau } from '~/lib/tuyau'
import { InferResponseType } from '@tuyau/react-query'

const _getReservationByUser = tuyau.users({ userId: 0 }).reservations.$get
export type Reservation = InferResponseType<
  typeof _getReservationByUser
>[number]

export const getReservationsByUserQueryOptions = (userId: string) =>
  tuyau.users({ userId }).reservations.$get.queryOptions()

export const getReservationsByEquipmentQueryOptions = (equip_numero: string) =>
  tuyau['sport-equipments']({ equip_numero }).reservations.$get.queryOptions()
