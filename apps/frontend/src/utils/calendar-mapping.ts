import { CalendarEvent } from '~/components/ui/full-calendar'
import { Reservation } from '~/lib/queries/reservations'

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
  })) as CalendarEvent[]
}

export function getColorByEventType(
  reservation: Reservation,
  userId: string
): string {
  // TODO: put red color if reservation is a closure by owner
  if (reservation.user.id == userId) {
    return 'green'
  } else {
    return 'default'
  }
}
