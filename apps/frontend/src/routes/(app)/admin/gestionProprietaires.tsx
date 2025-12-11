import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckIcon, ExternalLinkIcon, FileIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  getPendingOwnershipRequestsQueryOptions,
  type OwnershipRequest,
} from '~/lib/queries/sport-equipments'
import { queryClient, tuyau } from '~/lib/tuyau'

export const Route = createFileRoute('/(app)/admin/gestionProprietaires')({
  component: GestionProprietaires,
})

function GestionProprietaires() {
  const {
    data: requests,
    isLoading,
    refetch,
  } = useQuery({
    ...getPendingOwnershipRequestsQueryOptions,
    refetchOnMount: 'always',
  })

  const approveMutation = useMutation({
    mutationFn: (ownershipId: string) =>
      tuyau.sport_equipments.ownership[':ownershipId'].approve.$patch({
        params: { ownershipId },
      }),
    onSuccess: () => {
      toast.success('Demande approuvée avec succès')
      queryClient.invalidateQueries({
        queryKey: getPendingOwnershipRequestsQueryOptions.queryKey,
      })
    },
    onError: () => {
      toast.error("Erreur lors de l'approbation")
    },
  })

  const refuseMutation = useMutation({
    mutationFn: (ownershipId: string) =>
      tuyau.sport_equipments.ownership[':ownershipId'].refuse.$patch({
        params: { ownershipId },
      }),
    onSuccess: () => {
      toast.success('Demande refusée')
      queryClient.invalidateQueries({
        queryKey: getPendingOwnershipRequestsQueryOptions.queryKey,
      })
    },
    onError: () => {
      toast.error('Erreur lors du refus')
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Gestion des Propriétaires</h1>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Propriétaires</h1>
      <p className="text-muted-foreground mb-4">
        Liste des demandes de propriété en attente de validation
      </p>

      {requests && requests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-3 text-left">
                  Terrain
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left">
                  Nom
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left">
                  Email
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left">
                  Téléphone
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left">
                  Document
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left">
                  Date
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <OwnershipRequestRow
                  key={request.id}
                  request={request}
                  onApprove={() => approveMutation.mutate(request.id)}
                  onRefuse={() => refuseMutation.mutate(request.id)}
                  isApproving={approveMutation.isPending}
                  isRefusing={refuseMutation.isPending}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">
            Aucune demande en attente de validation
          </p>
        </div>
      )}
    </div>
  )
}

function OwnershipRequestRow({
  request,
  onApprove,
  onRefuse,
  isApproving,
  isRefusing,
}: {
  request: OwnershipRequest
  onApprove: () => void
  onRefuse: () => void
  isApproving: boolean
  isRefusing: boolean
}) {
  const formattedDate = new Date(request.createdAt).toLocaleDateString(
    'fr-FR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  )

  return (
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-200 px-4 py-3">
        <Link
          to="/equipment/$equipmentId"
          params={{ equipmentId: request.sportEquipmentId }}
          className="text-blue-600 hover:underline flex items-center gap-1"
        >
          {request.sportEquipmentName || request.sportEquipmentId}
          <ExternalLinkIcon className="size-3" />
        </Link>
      </td>
      <td className="border border-gray-200 px-4 py-3">
        {request.owner?.fullName || 'N/A'}
      </td>
      <td className="border border-gray-200 px-4 py-3">
        {request.owner?.email || 'N/A'}
      </td>
      <td className="border border-gray-200 px-4 py-3">
        {request.phoneNumber || 'N/A'}
      </td>
      <td className="border border-gray-200 px-4 py-3">
        {request.fileIdentification?.url ? (
          <DocumentPreview
            url={request.fileIdentification.url}
            name={request.fileIdentification.name}
            type={request.fileIdentification.type}
          />
        ) : (
          <span className="text-muted-foreground">Aucun document</span>
        )}
      </td>
      <td className="border border-gray-200 px-4 py-3">{formattedDate}</td>
      <td className="border border-gray-200 px-4 py-3">
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={onApprove}
            disabled={isApproving || isRefusing}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckIcon className="size-4 mr-1" />
            Approuver
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onRefuse}
            disabled={isApproving || isRefusing}
          >
            <XIcon className="size-4 mr-1" />
            Refuser
          </Button>
        </div>
      </td>
    </tr>
  )
}

function DocumentPreview({
  url,
  name,
  type,
}: {
  url: string
  name: string
  type: string
}) {
  const isImage = type.startsWith('image/')
  const isPdf = type === 'application/pdf'

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileIcon className="size-3" />
          Voir
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto">
          {isImage ? (
            <img
              src={url}
              alt={name}
              className="max-w-full h-auto rounded-lg"
            />
          ) : isPdf ? (
            <iframe src={url} className="w-full h-[60vh]" title={name} />
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">
                Aperçu non disponible pour ce type de fichier
              </p>
              <Button asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Télécharger le fichier
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
