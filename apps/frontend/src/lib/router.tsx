import { createRouter } from '@tanstack/react-router'
import { routeTree } from '~/routeTree.gen'
import { type AuthData } from '~/hooks/use-auth'
import { QueryClient } from '@tanstack/react-query'
import { NotFound } from '~/components/not-found'
import { DefaultCatchBoundary } from '~/components/default-catch-boundary'

export type RouterContext = {
  auth: AuthData
  queryClient: QueryClient
}

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    auth: undefined!,
    queryClient: new QueryClient(),
  },
  defaultErrorComponent: DefaultCatchBoundary,
  defaultNotFoundComponent: () => <NotFound />,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
