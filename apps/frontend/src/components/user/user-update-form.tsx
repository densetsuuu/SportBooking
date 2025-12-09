import { User } from '~/hooks/use-auth'
import { UserBanner } from '~/components/user/user-banner'
import { Pill, PillIndicator } from '~/components/ui/pill'
import { CalendarIcon, MapPinIcon, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { AuthProviderItem } from '~/components/auth/auth-provider-item'
import { DeleteAccountButton } from '~/components/user/delete-account-button'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateUserSchema } from '~/lib/schemas/user'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { usersQueries } from '~/lib/queries/user'
import { UserAvatarInput } from '~/components/user/user-avatar-input'
import { Button } from '~/components/ui/button'
import { AnimatePresence, motion } from 'motion/react'
import Calendar from '~/components/Calendar'
import { reservationsAsCalendarEvents } from '~/utils/calendar-mapping'
import { toast } from 'sonner'
import { getReservationsByUserQueryOptions } from '~/lib/queries/reservations'

export function UserUpdateForm({ user }: { user: User }) {
  const updateForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: '',
      bio: '',
      location: '',
      avatar: undefined,
    },
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const useUpdateUser = useMutation(usersQueries.update(user.id))

  const avatarFile = useWatch({ control: updateForm.control, name: 'avatar' })
  const isDirty = updateForm.formState.isDirty

  const {
    data: reservations,
    isLoading: reservationsIsLoading,
    error: reservationsError,
  } = useQuery(getReservationsByUserQueryOptions(user.id))

  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    void useUpdateUser.mutateAsync(
      {
        payload: values,
      },
      {
        onSuccess: () => {
          updateForm.reset()
        },
      }
    )
  }

  if (reservationsError) {
    // Add toast
    console.error(reservationsError)
    toast.error(
      'Une erreur est survenue lors de la récupérations des réservations.'
    )
  }

  return (
    <div className="my-8 flex flex-col items-center *:w-3xl gap-4">
      <Form {...updateForm}>
        <form
          onSubmit={updateForm.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="relative">
            <UserBanner
              avatarUrl={
                avatarFile ? URL.createObjectURL(avatarFile) : user.avatar?.url
              }
            />
            <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-8/10">
              <FormField
                control={updateForm.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-8/10">
                    <FormLabel hidden>Avatar</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...field}
                        ref={inputRef}
                        onChange={e => {
                          const file = e.target.files?.[0]
                          field.onChange(file)
                        }}
                        value={undefined}
                      />
                    </FormControl>
                    <UserAvatarInput
                      avatarFile={avatarFile}
                      user={user}
                      inputRef={inputRef}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center mb-10">
            <div className="inline-flex items-center gap-2">
              <p className="text-md font-semibold">{user.fullName}</p>
              <Pill className="bg-accent text-accent-foreground py-0.4 px-1.5 rounded-sm text-xs font-medium">
                <PillIndicator pulse variant="success" />
                Moi
              </Pill>
            </div>
            <div className="inline-flex items-center gap-3 text-muted-foreground *:inline-flex *:items-center *:gap-1 text-xs">
              <div>
                <MapPinIcon className="size-3" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query="
                  className="link font-normal"
                  target="_blank"
                  rel="noreferrer"
                >
                  Quelque part
                </a>
              </div>
              <div>
                <CalendarIcon className="size-3" />A rejoint en{' '}
                <p>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isDirty && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  duration: 0.5,
                }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
              >
                <Button
                  className="bg-primary text-primary-foreground shadow-lg px-6 py-3 gap-2"
                  loading={useUpdateUser.isPending}
                >
                  <Save className="size-4" />
                  Enregistrer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </Form>

      {user.socialAccounts?.length > 0 && (
        <Card className="gap-3">
          <CardHeader>
            <CardTitle>Comptes connectés</CardTitle>
          </CardHeader>
          <CardContent>
            {user.socialAccounts.map(account => (
              <AuthProviderItem account={account} key={account.id} />
            ))}
          </CardContent>
        </Card>
      )}

      {!reservationsIsLoading && !reservationsError ? (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              events={reservationsAsCalendarEvents(reservations ?? [], user.id)}
              onEventClick={event => {
                toast.message(`Réservation de ${event.title}`, {
                  description: `Du ${event.start.toLocaleString()} au ${event.end.toLocaleString()}`,
                })
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <div className="inline-flex w-full justify-end">
        <DeleteAccountButton user={user} />
      </div>
    </div>
  )
}
