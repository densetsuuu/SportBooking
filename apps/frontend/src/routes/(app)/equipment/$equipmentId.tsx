import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { equipmentQueries } from '~/lib/queries/sport-equipments'
import { getReservationsByEquipmentQueryOptions } from '~/lib/queries/reservations'
import { Icons } from '~/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { reservationsAsCalendarEvents } from '~/utils/calendar-mapping'
import Calendar from '~/components/Calendar'
import { MapPinIcon, ArrowLeft, ExternalLink, Clock, Info } from 'lucide-react'
import { ReservationDetailsModal } from '~/components/reservation-details-modal'
import { useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { BookButton } from '~/components/bookButton'
import { OwnerButton } from '~/components/ownerButton'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import {
  Map,
  MapTileLayer,
  MapMarker,
  MapZoomControl,
} from '~/components/ui/map'
import type { LatLngExpression } from 'leaflet'

export const Route = createFileRoute('/(app)/equipment/$equipmentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { equipmentId } = Route.useParams()
  const { user } = useAuth()
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data: equipment,
    isLoading: equipmentIsLoading,
    error: equipmentError,
  } = useQuery(equipmentQueries.get(equipmentId))

  const {
    data: reservations,
    isLoading: reservationsIsLoading,
    error: reservationsError,
  } = useQuery(getReservationsByEquipmentQueryOptions(equipmentId))

  if (equipmentIsLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col gap-4 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Icons.spinner size={32} color="currentColor" />
          </div>
          <p className="text-muted-foreground">
            Chargement de l&apos;équipement...
          </p>
        </motion.div>
      </div>
    )
  }

  if (equipmentError || !equipment) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col gap-4 justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Info className="w-10 h-10 text-destructive" />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Équipement non trouvé
          </h2>
          <p className="text-muted-foreground mb-6">
            {equipmentError?.message ??
              "Cet équipement n'existe pas ou a été supprimé."}
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  if (reservationsError) {
    console.error(reservationsError)
  }

  // Check if we have valid coordinates
  const hasCoordinates =
    equipment.equip_coordonnees?.lat && equipment.equip_coordonnees?.lon

  const center: LatLngExpression | null = hasCoordinates
    ? [equipment.equip_coordonnees!.lat, equipment.equip_coordonnees!.lon]
    : null

  // Google Maps link for external navigation
  const mapsLink = hasCoordinates
    ? `https://maps.google.com/maps?q=${equipment.equip_coordonnees!.lat},${equipment.equip_coordonnees!.lon}`
    : equipment.inst_adresse && equipment.lib_bdv
      ? `https://maps.google.com/maps?q=${encodeURIComponent(equipment.inst_adresse + ' ' + equipment.lib_bdv + ' ' + equipment.inst_cp)}`
      : '#'

  return (
    <div className="min-h-screen bg-gradient-radial pb-16">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sport-energy/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" size="sm" asChild className="group">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour
            </Link>
          </Button>
        </motion.div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero section with map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            {center ? (
              <div className="w-full h-64 md:h-80">
                <Map
                  center={center}
                  zoom={15}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <MapTileLayer />
                  <MapZoomControl />
                  <MapMarker
                    position={center}
                    icon={
                      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full shadow-lg border-2 border-white">
                        <MapPinIcon className="w-5 h-5 text-white" />
                      </div>
                    }
                    iconAnchor={[20, 20]}
                  />
                </Map>
              </div>
            ) : (
              <div className="w-full h-64 md:h-80 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPinIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Pas de carte disponible
                  </p>
                </div>
              </div>
            )}

            {/* Type badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute top-4 right-4 z-[500]"
            >
              <div className="px-4 py-2 rounded-xl bg-white/90 dark:bg-card/90 backdrop-blur-md shadow-lg border border-white/20">
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {equipment.equip_type_name}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Equipment info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center"
          >
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {equipment.equip_nom}
            </h1>

            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors group"
            >
              <MapPinIcon className="w-4 h-4" />
              <span className="group-hover:underline underline-offset-2">
                {equipment.inst_adresse}, {equipment.inst_cp}{' '}
                {equipment.lib_bdv}
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <BookButton
              equipment={{
                id: equipment.equip_numero,
                nom: equipment.equip_nom,
              }}
            />

            <OwnerButton
              equipment={{
                id: equipment.equip_numero,
                nom: equipment.equip_nom,
                ownerStatus: equipment.owner?.status,
                phoneNumber: equipment.owner?.phoneNumber,
              }}
            />
          </motion.div>

          {/* Calendar section */}
          {user && !reservationsIsLoading && !reservationsError ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="border-0 shadow-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <CardTitle>Calendrier des réservations</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Consultez les disponibilités et réservez votre créneau
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    events={reservationsAsCalendarEvents(
                      reservations ?? [],
                      user?.id
                    )}
                    onEventClick={event => {
                      setSelectedReservationId(event.id)
                      setIsModalOpen(true)
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : !user ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-card">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Connectez-vous pour voir le calendrier
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Créez un compte ou connectez-vous pour consulter les
                    disponibilités et réserver cet équipement.
                  </p>
                  <Button asChild>
                    <Link to="/login">Se connecter</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
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
