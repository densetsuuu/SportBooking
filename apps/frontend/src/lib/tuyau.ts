import {createTuyau} from '@tuyau/client'
import {QueryClient} from '@tanstack/react-query'
import {createTuyauReactQueryClient} from '@tuyau/react-query'

import {api} from '@sport-booking/backend/api'

export const queryClient = new QueryClient()
export const client = createTuyau({api, baseUrl: `http://localhost:3333`})
export const tuyau = createTuyauReactQueryClient({client, queryClient})
