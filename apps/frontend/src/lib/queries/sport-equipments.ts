import { InferResponseType } from '@tuyau/react-query'
import { tuyau } from '~/lib/tuyau'

export type SportEquipment = InferResponseType<
  typeof tuyau.sport_equipments.$get
>['data'][number]

export const getSportEquipmentQueryOptions =
  tuyau.sport_equipments.$get.queryOptions

const _getSportEquipmentById = tuyau.sport_equipments({ equip_numero: '' }).$get
export type SportEquipmentDetails = InferResponseType<
  typeof _getSportEquipmentById
>

export const getSportEquipmentByIdQueryOptions = (equipNumero: string) =>
  tuyau.sport_equipments({ equip_numero: equipNumero }).$get.queryOptions()

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

// Admin ownership management
export const getPendingOwnershipRequestsQueryOptions =
  tuyau.sport_equipments.ownership.pending.$get.queryOptions({
    staleTime: 0, // Always refetch when component mounts
  })

export type OwnershipRequest = InferResponseType<
  typeof tuyau.sport_equipments.ownership.pending.$get
>[number]

export const approveOwnershipMutationOptions = tuyau.sport_equipments.ownership[
  ':ownershipId'
].approve.$patch.mutationOptions({})

export const refuseOwnershipMutationOptions = tuyau.sport_equipments.ownership[
  ':ownershipId'
].refuse.$patch.mutationOptions({})
