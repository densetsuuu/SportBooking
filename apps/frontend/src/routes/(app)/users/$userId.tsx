import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { usersQueries } from '~/lib/queries/user'
import { Icons } from '~/components/icons'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { UserBanner } from '~/components/user/user-banner'
import { useAuth } from '~/hooks/use-auth'
import { UserUpdateForm } from '~/components/user/user-update-form'
import { UserAvatar } from '~/components/user-avatar'
import { getReservationsByUserQueryOptions } from '~/lib/queries/reservations'
import { reservationsAsCalendarEvents } from '~/utils/calendar-mapping'
import Calendar from '~/components/Calendar'
import { toast } from 'sonner'

export const Route = createFileRoute('/(app)/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const { user: currentUser } = useAuth()

  const {
    data: user,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery(usersQueries.get(userId))

  const {
    data: reservations,
    isLoading: reservationsIsLoading,
    error: reservationsError,
  } = useQuery(getReservationsByUserQueryOptions(userId))

  if (currentUser?.id === userId) {
    return <UserUpdateForm user={currentUser} />
  }

  if (userIsLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col gap-2 justify-center items-center overflow-hidden">
        <Icons.spinner size={30} />
        Veuillez patienter...
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="text-center mt-10 text-destructive">
        {userError?.message ?? 'Aucun utilisateur trouvé.'}
      </div>
    )
  }

  if (reservationsError) {
    // Add toast
    console.error(reservationsError)
    toast.error(
      'Une erreur est survenue lors de la récupérations des réservations.'
    )
  }

  return (
    <div className="my-8 flex flex-col items-center *:w-3xl gap-4">
      <div className="relative">
        <UserBanner avatarUrl={user.avatar?.url} />
        <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-8/10">
          <UserAvatar
            user={user}
            className="size-16 ring-4 ring-background bg-background [&>[data-slot=avatar-fallback]]:text-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center mb-10">
        <p className="text-md font-semibold">{user.fullName}</p>
        <div className="inline-flex items-center gap-3 text-muted-foreground *:inline-flex *:items-center *:gap-1 text-xs">
          <div>
            <MapPinIcon className="size-3" />
            <a
              href="https://www.google.com/maps/search/?api=1&query="
              className="link font-normal"
              target="_blank"
              rel="noreferrer"
            >
              Quelque part
            </a>
          </div>
          <div>
            <CalendarIcon className="size-3" />A rejoint en{' '}
            <p>
              {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
              })}
            </p>
          </div>
        </div>
      </div>

      {!reservationsIsLoading && !reservationsError ? (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              events={reservationsAsCalendarEvents(reservations ?? [], user.id)}
              onEventClick={event => {
                toast.message(`Réservation de ${event.title}`, {
                  description: `Du ${event.start.toLocaleString()} au ${event.end.toLocaleString()}`,
                })
              }}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
