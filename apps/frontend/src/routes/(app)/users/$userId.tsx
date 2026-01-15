import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { usersQueries } from '~/lib/queries/user'
import { Icons } from '~/components/icons'
import { CalendarIcon, UserIcon } from 'lucide-react'
import { useAuth } from '~/hooks/use-auth'
import { UserUpdateForm } from '~/components/user/user-update-form'
import { getReservationsByUserQueryOptions } from '~/lib/queries/reservations'
import { reservationsAsCalendarEvents } from '~/utils/calendar-mapping'
import Calendar from '~/components/Calendar'
import { ReservationDetailsModal } from '~/components/reservation-details-modal'
import { useState } from 'react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/(app)/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const { user: currentUser } = useAuth()
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    console.error(reservationsError)
  }

  const avatarUrl = user.avatar?.url

  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sport-energy/5 rounded-full blur-3xl" />
      </div>

      <div className="relative py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm py-0">
              {/* Banner Section - Avatar color based */}
              <div className="relative h-28 overflow-hidden">
                {/* Background from avatar */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: avatarUrl
                      ? `url(${avatarUrl})`
                      : 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary)/0.7))',
                  }}
                />
                {/* Blur overlay */}
                <div className="absolute inset-0 backdrop-blur-xl" />

                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Profile Content */}
              <div className="relative px-6 pb-6">
                {/* Avatar - overlapping banner */}
                <div className="flex items-end gap-4 -mt-10 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card shadow-xl overflow-hidden ring-2 ring-border/50">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <UserIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0 pb-1">
                    <h1
                      className="text-xl font-bold text-foreground truncate"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {user.fullName || 'Utilisateur'}
                    </h1>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>
                    Membre depuis{' '}
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Calendar Section */}
          {currentUser && !reservationsIsLoading && !reservationsError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="text-base font-semibold flex items-center gap-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <CalendarIcon className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    Réservations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    events={reservationsAsCalendarEvents(
                      reservations ?? [],
                      user.id
                    )}
                    onEventClick={event => {
                      setSelectedReservationId(event.id)
                      setIsModalOpen(true)
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <ReservationDetailsModal
        reservationId={selectedReservationId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
