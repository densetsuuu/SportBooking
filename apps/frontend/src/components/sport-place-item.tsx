import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Calendar, Clock, Users } from 'lucide-react'
import { SportEquipment } from '~/lib/queries/sport-equipments'
import { useMutation } from '@tanstack/react-query'
import { createReservationMutationOptions } from '~/lib/queries/reservation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { reservationSchema } from '~/lib/schemas/common'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type SportPlaceItemProps = {
  equipment: SportEquipment
}

export function SportPlaceItem({ equipment }: SportPlaceItemProps) {
  const useReservation = useMutation(createReservationMutationOptions)

  const form = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: '',
      timeSlot: '',
      participants: 1,
    },
  })
  const parseTimeSlot = (date: string, timeSlot: string) => {
    const [start, end] = timeSlot.split('-') // "10h" / "12h"

    const startHour = start.replace('h', '')
    const endHour = end.replace('h', '')

    const startDate = `${date}T${startHour.padStart(2, '0')}:00:00`
    const endDate = `${date}T${endHour.padStart(2, '0')}:00:00`

    return { startDate, endDate }
  }

  const handleSubmit = (data: {
    date: string
    timeSlot: string
    participants: number
  }) => {
    const { startDate, endDate } = parseTimeSlot(data.date, data.timeSlot)

    void useReservation.mutateAsync({
      payload: {
        sportEquipmentId: equipment.id,
        startDate,
        endDate,
        invitedUsers: Array.from(
          { length: data.participants - 1 },
          (_, i) => `user${i + 1}`
        ),
      },
    })
  }

  return (
    <Card className="overflow-hidden justify-items-start flex flex-col sm:flex-row shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="sm:w-1/3 relative">
        <img
          src={
            equipment.image ||
            'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60'
          }
          alt={equipment.nom}
          className="object-cover h-48 sm:h-full w-full"
        />
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold px-3 py-1 rounded-lg shadow-sm text-sm">
          {equipment.type}
        </div>
      </div>

      {/* Content */}
      <CardContent className="flex-1 flex flex-col justify-between p-6">
        <div className="flex flex-1 items-start flex-col">
          <CardHeader className="p-0 flex w-full mb-2">
            <CardTitle className="text-xl">{equipment.nom}</CardTitle>
          </CardHeader>
          <p className="text-sm text-muted-foreground mb-1">
            📍 {equipment.address}
          </p>
          <p className="text-gray-700 text-sm mb-3">
            {equipment.description || 'Aucune description disponible.'}
          </p>

          <ul className="text-sm flex items-start gap-4 text-gray-600">
            <li>👥 Capacité: {equipment.capacite ?? '?'}</li>
            <li>
              🏙️ {equipment.postalCode} {equipment.libBdv}
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="flex gap-3 mt-5">
          {/* Voir détails */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Voir détails</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{equipment.nom}</DialogTitle>
                <DialogDescription>{equipment.description}</DialogDescription>
              </DialogHeader>
              <img
                src={
                  equipment.image ||
                  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60'
                }
                alt={equipment.nom}
                className="w-full h-60 object-cover my-4 rounded"
              />
              <p>📍 {equipment.address}</p>
              <p>
                🏙️ {equipment.postalCode} {equipment.libBdv}
              </p>
              <p>👥 Capacité: {equipment.capacite ?? '?'}</p>
            </DialogContent>
          </Dialog>

          {/* Réserver */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-700">
                Réserver maintenant
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Réserver {equipment.nom}</DialogTitle>
                <DialogDescription>
                  Complétez les informations ci-dessous pour finaliser votre
                  réservation.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4 mt-4"
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex gap-2">
                          <Calendar className="w-4 h-4" />
                          <FormLabel>Date</FormLabel>
                        </div>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex gap-2">
                          <Clock className="w-4 h-4" />
                          <FormLabel>Créneau horaire</FormLabel>
                        </div>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir un créneau" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10h-12h">10h - 12h</SelectItem>
                              <SelectItem value="12h-14h">12h - 14h</SelectItem>
                              <SelectItem value="14h-16h">14h - 16h</SelectItem>
                              <SelectItem value="16h-18h">16h - 18h</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="participants"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <div className="flex gap-2">
                          <Users className="w-4 h-4" />
                          <FormLabel>Nombre de participants</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={e =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="mt-6 flex justify-end gap-2">
                    <DialogTrigger asChild>
                      <Button variant="outline">Annuler</Button>
                    </DialogTrigger>
                    <Button
                      type="submit"
                      className="bg-black hover:bg-gray-700"
                      disabled={useReservation.isPending}
                    >
                      Confirmer la réservation
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
