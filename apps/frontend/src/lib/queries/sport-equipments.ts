import { InferResponseType } from '@tuyau/react-query'
import { tuyau } from '~/lib/tuyau'

export type SportEquipment = InferResponseType<
  typeof tuyau.sport_equipments.$get
>['data'][number]

export const getSportEquipmentQueryOptions =
  tuyau.sport_equipments.$get.queryOptions

export const assignOwnerMutationOptions = tuyau.sport_equipments[
  ':equip_numero'
].owner.$post.mutationOptions({})
