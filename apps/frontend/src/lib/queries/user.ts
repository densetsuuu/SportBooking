import { tuyau } from '../tuyau'

export const getUserQueryOptions = (userId: string) =>
  tuyau.users({ userId }).$get.queryOptions()
