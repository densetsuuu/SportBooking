import React, { useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservationSchema } from '~/lib/schemas/common'
import { useMutation } from '@tanstack/react-query'
import { createReservationMutationOptions } from '~/lib/queries/reservation'
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react'
import { DateTimeInput } from '~/components/datetime-input'
import { DateTimePicker } from '~/components/datetime-picker'
import { Input } from '~/components/ui/input'

export function BookButton({
  equipment,
}: {
  equipment: { id: string; nom: string }
}) {
  const auth = useAuth()
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const useReservation = useMutation(createReservationMutationOptions)

  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      participants: 1,
    },
  })

  const handleSubmit = async (data: {
    startDate: Date
    endDate: Date
    participants: number
  }) => {
    setError(null)
    setSuccess(null)
    try {
      await useReservation.mutateAsync({
        payload: {
          sportEquipmentId: equipment.id,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          invitedUsers: Array.from(
            { length: data.participants - 1 },
            (_, i) => `user${i + 1}`
          ),
        },
      })
      setSuccess('Réservation effectuée avec succès !')
      setTimeout(() => setIsReservationOpen(false), 2000)
    } catch {
      setError('Une erreur est survenue lors de la réservation.')
    }
  }

  return (
    <>
      {auth.user && (
        <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <FormLabel>Date & heure de début</FormLabel>
                      </div>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          timePicker={{ hour: true, minute: true }}
                          renderTrigger={({ open, value, setOpen }) => (
                            <DateTimeInput
                              value={value}
                              onChange={x => !open && field.onChange(x)}
                              format="dd/MM/yyyy HH:mm"
                              disabled={open}
                              onCalendarClick={() => setOpen(!open)}
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex gap-2">
                        <Clock className="w-4 h-4" />
                        <FormLabel>Date & heure de fin</FormLabel>
                      </div>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          timePicker={{ hour: true, minute: true }}
                          renderTrigger={({ open, value, setOpen }) => (
                            <DateTimeInput
                              value={value}
                              onChange={x => !open && field.onChange(x)}
                              format="dd/MM/yyyy HH:mm"
                              disabled={open}
                              onCalendarClick={() => setOpen(!open)}
                            />
                          )}
                        />
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
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}

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
      )}
    </>
  )
}
