import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

type User = {
  id: number
  firstname: string
  lastname: string
  email: string
  role: string
}

export const Route = createFileRoute('/users/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/users/${userId}`, { credentials: 'include' })

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`)
        }

        const data = await res.json()
        setUser(data)
      } catch (err: any) {
        setError('Impossible de charger les informations de l’utilisateur.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (isLoading) {
    return <p className="text-center mt-10 text-muted-foreground">Chargement...</p>
  }

  if (error || !user) {
    return (
      <div className="text-center mt-10 text-destructive">
        {error ?? 'Aucun utilisateur trouvé.'}
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
          <InfoRow label="Prénom" value={user.firstname} />
          <InfoRow label="Nom" value={user.lastname} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Rôle" value={user.role} />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-base">{value}</p>
      <Separator className="my-2" />
    </div>
  )
}
