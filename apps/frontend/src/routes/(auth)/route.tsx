import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen w-full inline-flex items-center justify-center">
      <Outlet />
    </div>
  )
}
