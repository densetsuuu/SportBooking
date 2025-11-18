import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { usersQueries } from '~/lib/queries/user'
import { getCurrentUserQueryOptions } from '~/lib/queries/auth'
import { Icons } from '~/components/icons'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { AuthProviderItem } from '~/components/auth/auth-provider-item'
import { useAuth } from '~/hooks/use-auth'
import { UserBanner } from '~/components/user/user-banner'
import { DeleteAccountButton } from '~/components/user/delete-account-button'
import { ProtectedContent } from '~/components/protected-content'

export const Route = createFileRoute('/(app)/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const { user: currentUser } = useAuth()

  const isCurrentUser = currentUser?.id === userId
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(
    isCurrentUser ? getCurrentUserQueryOptions : usersQueries.get(userId)
  )

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col gap-2 justify-center items-center overflow-hidden">
        <Icons.spinner size={30} />
        Veuillez patienter...
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="text-center mt-10 text-destructive">
        {error?.message ?? 'Aucun utilisateur trouvé.'}
      </div>
    )
  }

  return (
    <div className="my-8 flex flex-col items-center *:w-3xl gap-4">
      <UserBanner user={user} />

      <div className="flex flex-col gap-2 items-center mb-10">
        <p className="text-md font-semibold">{user.fullName}</p>
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

      <ProtectedContent predicate={isCurrentUser}>
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
      </ProtectedContent>

      <Card>
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Cette section sera ajoutée ultérieurement.
          </p>
        </CardContent>
      </Card>

      <div className="inline-flex w-full justify-end">
        <DeleteAccountButton user={user} />
      </div>
    </div>
  )
}
