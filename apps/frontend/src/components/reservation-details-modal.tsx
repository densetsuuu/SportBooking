import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  getReservationByIdQueryOptions,
  Invitation,
} from '~/lib/queries/reservations'
import { getSportEquipmentByIdQueryOptions } from '~/lib/queries/sport-equipments'
import { Icons } from '~/components/icons'
import { CalendarIcon, Clock, Users, MapPin } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { UserAvatar } from '~/components/user-avatar'
import { Link, useParams } from '@tanstack/react-router'

type ReservationDetailsModalProps = {
  reservationId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReservationDetailsModal({
  reservationId,
  open,
  onOpenChange,
}: ReservationDetailsModalProps) {
  const params = useParams({ strict: false })

  const {
    data: reservation,
    isLoading,
    error,
  } = useQuery({
    ...getReservationByIdQueryOptions(reservationId ?? ''),
    enabled: !!reservationId && open,
  })

  const { data: sportEquipment, isLoading: isLoadingSportEquipment } = useQuery(
    {
      ...getSportEquipmentByIdQueryOptions(reservation?.sportEquipmentId ?? ''),
      enabled: !!reservation?.sportEquipmentId,
    }
  )

  const handleUserClick = (userId: string) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      const currentUserId = (params as { userId?: string }).userId
      if (currentUserId === userId) {
        e.preventDefault()
        onOpenChange(false)
        window.location.reload()
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getInvitationStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Acceptée', variant: 'default' as const },
      refused: { label: 'Refusée', variant: 'destructive' as const },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
          <DialogDescription>
            Informations complètes sur cette réservation
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col gap-2 justify-center items-center py-8">
            <Icons.spinner size={30} />
            <p className="text-sm text-muted-foreground">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-destructive">
            <p>
              Une erreur est survenue lors du chargement des détails de la
              réservation.
            </p>
          </div>
        )}

        {reservation && !isLoading && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Statut:</span>
              {getStatusBadge(reservation.status)}
            </div>

            {/* Dates */}
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Date de début</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(reservation.startDate).toLocaleString('fr-FR', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Date de fin</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(reservation.endDate).toLocaleString('fr-FR', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Utilisateur</p>
              <Link
                to="/users/$userId"
                params={{ userId: reservation.user.id }}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
                onClick={handleUserClick(reservation.user.id)}
              >
                <UserAvatar user={reservation.user} className="size-10" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {reservation.user.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {reservation.user.email}
                  </p>
                </div>
              </Link>
            </div>

            {/* Invitations */}
            {reservation.invitations && reservation.invitations.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Participants invités ({reservation.invitations.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {reservation.invitations.map((invitation: Invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <Link
                        to="/users/$userId"
                        params={{ userId: invitation.user.id }}
                        className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
                        onClick={handleUserClick(invitation.user.id)}
                      >
                        <UserAvatar user={invitation.user} className="size-8" />
                        <div>
                          <p className="text-sm font-medium">
                            {invitation.user.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invitation.user.email}
                          </p>
                        </div>
                      </Link>
                      {getInvitationStatusBadge(invitation.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sport Equipment */}
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Équipement sportif</p>
                  {isLoadingSportEquipment ? (
                    <div className="flex items-center gap-2">
                      <Icons.spinner size={16} />
                      <p className="text-sm text-muted-foreground">
                        Chargement...
                      </p>
                    </div>
                  ) : sportEquipment ? (
                    <div>
                      <p className="text-sm text-foreground">
                        {sportEquipment.equip_nom}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {sportEquipment.equip_type_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sportEquipment.inst_adresse}
                        {sportEquipment.lib_bdv &&
                          `, ${sportEquipment.lib_bdv}`}
                      </p>
                      <Link
                        to="/equipment/$equipmentId"
                        params={{ equipmentId: reservation.sportEquipmentId }}
                        className="text-xs text-primary hover:underline mt-2 inline-block"
                      >
                        Voir les détails →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-mono">
                      {reservation.sportEquipmentId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
