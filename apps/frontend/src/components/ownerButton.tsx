import React, { useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { Dialog, DialogContent, DialogFooter } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { ClaimEstablishmentForm } from '~/components/claim-establishment-form'

export function OwnerButton({
  equipment,
}: {
  equipment: {
    id: string
    nom: string
    ownerStatus: string | undefined
    phoneNumber: string | null | undefined
  }
}) {
  const auth = useAuth()
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState<boolean>(false)

  return (
    <>
      {equipment.ownerStatus === 'approved' ? (
        <DialogFooter className="mt-4">
          <Button variant="outline" className="w-full" disabled>
            Contacter le propriétaire : {equipment.phoneNumber}
          </Button>
        </DialogFooter>
      ) : (
        auth.user && (
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsClaimDialogOpen(true)}
            >
              Revendiquer cet établissement
            </Button>
          </DialogFooter>
        )
      )}

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
    </>
  )
}
