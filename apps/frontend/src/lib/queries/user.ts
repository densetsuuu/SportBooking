import { tuyau } from "../tuyau";

export const getUserQueryOptions = (userId:string) => tuyau.user({userId}).$get.queryOptions();