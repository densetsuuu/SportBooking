import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ClaimEstablishmentForm } from '~/components/claim-establishment-form'
import { DateTimeInput } from '~/components/datetime-input'
import { DateTimePicker } from '~/components/datetime-picker'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { createReservationMutationOptions } from '~/lib/queries/reservation'
import { SportEquipment } from '~/lib/queries/sport-equipments'
import { reservationSchema } from '~/lib/schemas/common'

type SportPlaceItemProps = {
  equipment: SportEquipment
}

export function SportPlaceItem({ equipment }: SportPlaceItemProps) {
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState<boolean>(false)
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
          sportEquipmentId: equipment.id!,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          invitedUsers: Array.from(
            { length: data.participants - 1 },
            (_, i) => `user${i + 1}`
          ),
        },
      })
      setSuccess('Réservation confirmée !')
    } catch (err: any) {
      setError('Erreur lors de la réservation. ' + (err.message || ''))
    }
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
            {equipment.address}
          </p>
          <p className="text-gray-700 text-sm mb-3">
            {equipment.description || 'Aucune description disponible.'}
          </p>

          <ul className="text-sm flex items-start gap-4 text-gray-600">
            <li> Capacité: {equipment.capacite ?? '?'}</li>
            <li>
              {equipment.postalCode} {equipment.libBdv}
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
              <p> {equipment.address}</p>
              <p>
                {equipment.postalCode} {equipment.libBdv}
              </p>
              <p> Capacité: {equipment.capacite ?? '?'}</p>

              {!equipment.hasApprovedOwner && (
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsClaimDialogOpen(true)}
                  >
                    Revendiquer cet établissement
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>

          {/* Revendiquer l'établissement Dialog */}
          <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
            <DialogContent className="max-w-2xl">
              <ClaimEstablishmentForm
                equipmentId={equipment.id || ''}
                equipmentName={equipment.nom || ''}
                onSuccess={() => setIsClaimDialogOpen(false)}
                onCancel={() => setIsClaimDialogOpen(false)}
              />
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
                            onChange={e =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {success && (
                    <p className="text-sm text-green-600">{success}</p>
                  )}

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
