import { User } from '~/hooks/use-auth'
import { Pill, PillIndicator } from '~/components/ui/pill'
import { CalendarIcon, Save, PencilIcon, UserIcon } from 'lucide-react'
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
import { useRef, useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { usersQueries } from '~/lib/queries/user'
import { Button } from '~/components/ui/button'
import { AnimatePresence, motion } from 'motion/react'
import Calendar from '~/components/Calendar'
import { reservationsAsCalendarEvents } from '~/utils/calendar-mapping'
import { getReservationsByUserQueryOptions } from '~/lib/queries/reservations'
import { ReservationDetailsModal } from '~/components/reservation-details-modal'

export function UserUpdateForm({ user }: { user: User }) {
  const updateForm = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.fullName || '',
      bio: '',
      avatar: undefined,
    },
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const useUpdateUser = useMutation(usersQueries.update(user.id))
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editingName, setEditingName] = useState(user.fullName || '')
  const nameInputRef = useRef<HTMLInputElement>(null)

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

  const handleNameSave = () => {
    if (editingName.trim() && editingName.trim() !== user.fullName) {
      void useUpdateUser.mutateAsync({
        payload: { fullName: editingName.trim() },
      })
    }
    setIsEditingName(false)
  }

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [isEditingName])

  if (reservationsError) {
    console.error(reservationsError)
  }

  const avatarUrl = avatarFile
    ? URL.createObjectURL(avatarFile)
    : user.avatar?.url

  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sport-energy/5 rounded-full blur-3xl" />
      </div>

      <div className="relative py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm py-0">
              <Form {...updateForm}>
                <form onSubmit={updateForm.handleSubmit(onSubmit)}>
                  {/* Banner Section - Avatar color based */}
                  <div className="relative h-28 overflow-hidden">
                    {/* Background from avatar */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: avatarUrl
                          ? `url(${avatarUrl})`
                          : 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--secondary)/0.7))',
                      }}
                    />
                    {/* Blur overlay */}
                    <div className="absolute inset-0 backdrop-blur-xl" />

                    {/* Gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Status pill */}
                    <div className="absolute top-3 right-3">
                      <Pill className="bg-white/20 backdrop-blur-sm text-white py-1 px-3 rounded-full text-xs font-medium border border-white/30">
                        <PillIndicator pulse variant="success" />
                        En ligne
                      </Pill>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="relative px-6 pb-6">
                    {/* Avatar - overlapping banner */}
                    <div className="flex items-end gap-4 -mt-10 mb-4">
                      <FormField
                        control={updateForm.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem>
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
                            <button
                              type="button"
                              onClick={() => inputRef.current?.click()}
                              className="relative group"
                            >
                              <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card shadow-xl overflow-hidden ring-2 ring-border/50">
                                {avatarUrl ? (
                                  <img
                                    src={avatarUrl}
                                    alt={user.fullName}
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                                    <UserIcon className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              {/* Hover overlay - inset to not cover border */}
                              <div className="absolute inset-1 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <PencilIcon className="w-5 h-5 text-white" />
                              </div>
                            </button>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Name and badge */}
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <AnimatePresence mode="wait">
                            {isEditingName ? (
                              <motion.div
                                key="editing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-[200px]"
                              >
                                <Input
                                  ref={nameInputRef}
                                  value={editingName}
                                  onChange={e => setEditingName(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') handleNameSave()
                                    if (e.key === 'Escape') {
                                      setEditingName(user.fullName || '')
                                      setIsEditingName(false)
                                    }
                                  }}
                                  onBlur={handleNameSave}
                                  placeholder="Votre nom"
                                  className="text-lg font-bold h-9 bg-background border-secondary/50 focus:border-secondary"
                                  style={{ fontFamily: 'Outfit, sans-serif' }}
                                />
                              </motion.div>
                            ) : (
                              <motion.button
                                key="display"
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsEditingName(true)}
                                className="group/name flex items-center gap-2"
                              >
                                <h1
                                  className="text-xl font-bold text-foreground truncate"
                                  style={{ fontFamily: 'Outfit, sans-serif' }}
                                >
                                  {user.fullName || 'Ajouter un nom'}
                                </h1>
                                <PencilIcon className="w-3.5 h-3.5 text-secondary opacity-0 group-hover/name:opacity-100 transition-opacity flex-shrink-0" />
                              </motion.button>
                            )}
                          </AnimatePresence>

                          <Pill className="bg-secondary/10 text-secondary py-0.5 px-2 rounded-md text-xs font-semibold flex-shrink-0">
                            Moi
                          </Pill>
                        </div>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>
                        Membre depuis{' '}
                        {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Floating Save Button */}
                  <AnimatePresence>
                    {isDirty && (
                      <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                        }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                      >
                        <Button
                          type="submit"
                          className="bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25 px-6 py-3 gap-2 rounded-full"
                          loading={useUpdateUser.isPending}
                        >
                          <Save className="w-4 h-4" />
                          <span style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Enregistrer
                          </span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </Form>
            </Card>
          </motion.div>

          {/* Connected Accounts */}
          {user.socialAccounts?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="text-base font-semibold flex items-center gap-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <UserIcon className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    Comptes connectés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user.socialAccounts.map(account => (
                    <AuthProviderItem account={account} key={account.id} />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Calendar Section */}
          {!reservationsIsLoading && !reservationsError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle
                    className="text-base font-semibold flex items-center gap-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <CalendarIcon className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    Mes réservations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    events={reservationsAsCalendarEvents(
                      reservations ?? [],
                      user.id
                    )}
                    onEventClick={event => {
                      setSelectedReservationId(event.id)
                      setIsModalOpen(true)
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle
                  className="text-base font-semibold text-destructive"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Zone de danger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Cette action est irréversible. Toutes vos données seront
                  supprimées.
                </p>
                <DeleteAccountButton user={user} />
              </CardContent>
            </Card>
          </motion.div>
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
