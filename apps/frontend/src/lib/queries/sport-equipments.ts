import { InferResponseType } from '@tuyau/react-query'
import { tuyau } from '~/lib/tuyau'

export type SportEquipment = InferResponseType<
  typeof tuyau.sport_equipments.$get
>['data'][number]

export const getSportEquipmentQueryOptions =
  tuyau.sport_equipments.$get.queryOptions

export const equipmentQueries = {
  get: (equip_numero: string) =>
    tuyau['sport_equipments']({ equip_numero }).$get.queryOptions({
      params: {
        equip_numero,
      },
    }),
}
export const assignOwnerMutationOptions = tuyau.sport_equipments[
  ':equip_numero'
].owner.$post.mutationOptions({})
