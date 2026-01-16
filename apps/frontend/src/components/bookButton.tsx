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
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react'
import { DateTimeInput } from '~/components/datetime-input'
import { DateTimePicker } from '~/components/datetime-picker'
import { Input } from '~/components/ui/input'
import { AnimatePresence, motion } from 'motion/react'

export function BookButton({
  equipment,
  size = 'default',
  className,
  label = 'Réserver maintenant',
}: {
  equipment: { id: string; nom: string }
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  label?: string
}) {
  const auth = useAuth()
  const [isReservationOpen, setIsReservationOpen] = useState(false)
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
    void useReservation.mutateAsync({
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
  }

  return (
    <>
      {auth.user && (
        <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size={size} className={className}>
              <CalendarIcon className="w-4 h-4" />
              <span style={{ fontFamily: 'Outfit, sans-serif' }}>{label}</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle
                className="text-xl"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Réserver {equipment.nom}
              </DialogTitle>
              <DialogDescription>
                Complétez les informations ci-dessous pour finaliser votre
                réservation.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5 mt-4"
              >
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 text-secondary" />
                        </div>
                        <FormLabel
                          className="font-medium"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          Date & heure de début
                        </FormLabel>
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
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-secondary" />
                        </div>
                        <FormLabel
                          className="font-medium"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          Date & heure de fin
                        </FormLabel>
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
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-secondary" />
                        </div>
                        <FormLabel
                          className="font-medium"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          Nombre de participants
                        </FormLabel>
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

                <AnimatePresence>
                  {useReservation.isError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {useReservation.isError}
                    </motion.div>
                  )}
                  {useReservation.isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-sport-energy/10 text-sport-field text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {useReservation.isSuccess}
                    </motion.div>
                  )}
                </AnimatePresence>

                <DialogFooter className="mt-6 flex justify-end gap-3">
                  <DialogTrigger asChild>
                    <Button variant="outline">Annuler</Button>
                  </DialogTrigger>
                  <Button
                    type="submit"
                    variant="secondary"
                    loading={useReservation.isPending}
                  >
                    <span style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Confirmer
                    </span>
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
