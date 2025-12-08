import {
  Calendar as FullCalendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarEvent,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from '~/components/ui/full-calendar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fr } from 'date-fns/locale'

type CalendarProps = {
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
}

export default function Calendar({ events, onEventClick }: CalendarProps) {
  return (
    <FullCalendar events={events} onEventClick={onEventClick} locale={fr}>
      <div className="h-dvh py-6 flex flex-col">
        <div className="flex px-6 items-center gap-2 mb-6">
          <CalendarViewTrigger
            className="aria-[current=true]:bg-accent"
            view="day"
          >
            Jour
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="week"
            className="aria-[current=true]:bg-accent"
          >
            Semaine
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="month"
            className="aria-[current=true]:bg-accent"
          >
            Mois
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="year"
            className="aria-[current=true]:bg-accent"
          >
            Année
          </CalendarViewTrigger>

          <span className="flex-1" />

          <CalendarCurrentDate />

          <CalendarPrevTrigger>
            <ChevronLeft size={20} />
            <span className="sr-only">Précédent</span>
          </CalendarPrevTrigger>

          <CalendarTodayTrigger>Aujourd&#39;hui</CalendarTodayTrigger>

          <CalendarNextTrigger>
            <ChevronRight size={20} />
            <span className="sr-only">Suivant</span>
          </CalendarNextTrigger>
        </div>

        <div className="flex-1 overflow-auto px-6 relative">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </FullCalendar>
  )
}
