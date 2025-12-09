import { CalendarEvent } from '~/components/ui/full-calendar'
import { Reservation } from '~/lib/queries/reservations'
import { match } from 'ts-pattern'

export function reservationsAsCalendarEvents(
  reservations: Reservation[],
  userId: string
): CalendarEvent[] {
  return reservations.map(reservation => ({
    id: reservation.id,
    title: reservation.user.fullName,
    start: new Date(reservation.startDate),
    end: new Date(reservation.endDate),
    color: getColorByEventType(reservation, userId),
  }))
}

export function getColorByEventType(reservation: Reservation, userId: string) {
  return match(reservation)
    .with({ user: { id: userId } }, () => 'green' as const)
    .otherwise(() => 'default' as const)
}
