import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { getUserQueryOptions } from '~/lib/queries/user'

export const Route = createFileRoute('/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()

  const { data: user, isLoading, error } = useQuery(getUserQueryOptions(userId))
  if (isLoading) {
    return (
      <p className="text-center mt-10 text-muted-foreground">Chargement...</p>
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
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* SECTION 1 — Informations générales */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Nom complet" value={user.fullName} />
          <InfoRow label="Email" value={user.email} />
        </CardContent>
      </Card>

      {/* SECTION 2 — Calendrier */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Cette section sera ajoutée ultérieurement.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-base">{value}</p>
      <Separator className="my-2" />
    </div>
  )
}
