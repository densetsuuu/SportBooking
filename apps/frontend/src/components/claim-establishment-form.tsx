import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import FileUpload from '~/components/file-upload'
import { Button } from '~/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useAuth } from '~/hooks/use-auth'
import { assignOwnerMutationOptions } from '~/lib/queries/sport-equipments'

type ClaimEstablishmentFormProps = {
  equipmentId: string
  equipmentName: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ClaimEstablishmentForm({
  equipmentId,
  equipmentName,
  onSuccess,
  onCancel,
}: ClaimEstablishmentFormProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()

  const mutation = useMutation({
    ...assignOwnerMutationOptions,
    onSuccess: () => {
      setSuccess('Votre demande a été enregistrée avec succès !')
      setError(null)
      setTimeout(() => {
        onSuccess?.()
      }, 1500)
    },
    onError: (err: Error) => {
      setError(err.message || 'Une erreur est survenue')
      setSuccess(null)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!user) {
      setError('Vous devez être connecté pour revendiquer un établissement')
      return
    }

    if (!phoneNumber) {
      setError('Veuillez renseigner un numéro de téléphone')
      return
    }

    if (files.length === 0) {
      setError('Veuillez uploader au moins un justificatif')
      return
    }

    mutation.mutate({
      params: { equip_numero: equipmentId },
      payload: {
        userId: user.id,
        file: files[0],
        phoneNumber,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Revendiquer {equipmentName}</DialogTitle>
        <DialogDescription>
          Pour revendiquer cet établissement, veuillez fournir un justificatif
          prouvant que vous êtes bien le propriétaire ainsi qu&apos;un numéro de
          téléphone de contact.
        </DialogDescription>
      </DialogHeader>

      <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="phone">
            Numéro de téléphone de l&apos;établissement *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Justificatif(s) de propriété *</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Veuillez uploader un ou plusieurs documents prouvant que vous êtes
            le propriétaire (KBIS, titre de propriété, bail commercial, etc.)
          </p>
          <FileUpload
            onChange={setFiles}
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
          />
          {files.length > 0 && (
            <p className="text-sm text-green-600">
              {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné
              {files.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={mutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-black hover:bg-gray-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Envoi en cours...' : 'Soumettre ma demande'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}
