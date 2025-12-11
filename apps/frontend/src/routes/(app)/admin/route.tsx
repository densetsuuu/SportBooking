import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/admin')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.auth.ensureData()

    // Redirect to home if not logged in
    if (!user) {
      throw redirect({
        to: '/login',
      })
    }

    // Redirect to home if not admin
    if (user.type !== 'admin') {
      throw redirect({
        to: '/',
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
