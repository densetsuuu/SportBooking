import { useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { ClaimEstablishmentForm } from '~/components/claim-establishment-form'
import { Phone, Building } from 'lucide-react'

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
        <Button variant="outline" disabled className="gap-2">
          <Phone className="w-4 h-4" />
          <span style={{ fontFamily: 'Outfit, sans-serif' }}>
            {equipment.phoneNumber}
          </span>
        </Button>
      ) : (
        auth.user && (
          <Button
            variant="outline"
            onClick={() => setIsClaimDialogOpen(true)}
            className="gap-2"
          >
            <Building className="w-4 h-4" />
            <span style={{ fontFamily: 'Outfit, sans-serif' }}>
              Revendiquer
            </span>
          </Button>
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
