import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { equipmentQueries } from '~/lib/queries/sport-equipments'
import { getReservationsByEquipmentQueryOptions } from '~/lib/queries/reservations'
import { Icons } from '~/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { reservationsAsCalendarEvents } from '~/utils/calendar-mapping'
import Calendar from '~/components/Calendar'
import { MapPinIcon } from 'lucide-react'
import { ReservationDetailsModal } from '~/components/reservation-details-modal'
import { useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { BookButton } from '~/components/bookButton'
import { OwnerButton } from '~/components/ownerButton'

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
      <div className="h-[calc(100vh-8rem)] flex flex-col gap-2 justify-center items-center overflow-hidden">
        <Icons.spinner size={30} />
        Veuillez patienter...
      </div>
    )
  }

  if (equipmentError || !equipment) {
    return (
      <div className="text-center mt-10 text-destructive">
        {equipmentError?.message ?? 'Aucun utilisateur trouvé.'}
      </div>
    )
  }

  if (reservationsError) {
    console.error(reservationsError)
  }

  const coordUrl =
    equipment.equip_coordonnees?.lat && equipment.equip_coordonnees?.lon
      ? `https://maps.google.com/maps?q=${equipment.equip_coordonnees.lat},${equipment.equip_coordonnees.lon}&hl=fr&z=14&output=embed`
      : equipment.inst_adresse &&
        equipment.lib_bdv &&
        `https://maps.google.com/maps?q=${encodeURIComponent(equipment.inst_adresse + equipment.lib_bdv + equipment.inst_cp)}&hl=fr&z=14&output=embed`

  return (
    <div className="my-8 flex flex-col items-center *:w-3xl gap-4">
      <div className="sm:w-2/3 relative h-48 rounded-lg overflow-hidden shadow-md">
        {coordUrl ? (
          <div className="w-full h-48 sm:h-full">
            <iframe
              src={coordUrl}
              width="150"
              height="100"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <p>Pas d&#39;image disponible</p>
        )}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold px-3 py-1 rounded-lg shadow-sm text-sm">
          {equipment.equip_type_name}
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center mb-10">
        <p className="text-md font-semibold">{equipment.equip_nom}</p>
        <div className="inline-flex items-center gap-3 text-muted-foreground *:inline-flex *:items-center *:gap-1 text-xs">
          <div>
            <MapPinIcon className="size-3" />
            <a
              href={coordUrl?.replace('&output=embed', '') || '#'}
              className="link font-normal"
              target="_blank"
              rel="noreferrer"
            >
              {equipment.inst_adresse}, {equipment.inst_cp} {equipment.lib_bdv}
            </a>
          </div>
        </div>
      </div>

      <BookButton
        equipment={{ id: equipment.equip_numero, nom: equipment.equip_nom }}
      />

      <OwnerButton
        equipment={{
          id: equipment.equip_numero,
          nom: equipment.equip_nom,
          ownerStatus: equipment.owner?.status,
          phoneNumber: equipment.owner?.phoneNumber,
        }}
      />

      {user && !reservationsIsLoading && !reservationsError ? (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
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
      ) : null}

      <ReservationDetailsModal
        reservationId={selectedReservationId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
