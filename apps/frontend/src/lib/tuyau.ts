import { createTuyau, TuyauHTTPError } from '@tuyau/client'
import { QueryClient } from '@tanstack/react-query'
import { createTuyauReactQueryClient } from '@tuyau/react-query'

import { api } from '@sport-booking/backend/api'
import { toast } from 'sonner'

interface ValidationError extends TuyauHTTPError {
  value: {
    errors: {
      field: string
      message: string
    }[]
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
    mutations: {
      onError: (error: unknown) => {
        if (error instanceof TuyauHTTPError) {
          switch (error.status) {
            case 403:
            case 422: {
              const validationError = error as ValidationError
              validationError.value.errors.forEach(err => {
                toast.error('Une erreur est survenue', {
                  description: `${err.message}`,
                })
              })
              return
            }
            case 500:
              toast.error('Une erreur est survenue')
              return
            default:
              toast.error('Une erreur est survenue', {
                description: (error.value as Error).message,
              })
              return
          }
        } else {
          toast.error('Une erreur est survenue')
        }
      },
    },
  },
})
export const client = createTuyau({
  api,
  baseUrl: `http://localhost:3333`,
  credentials: 'include',
})
export const tuyau = createTuyauReactQueryClient({ client, queryClient })
