import { useState } from 'react'
import { ClaimEstablishmentForm } from '~/components/claim-establishment-form'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { SportEquipment } from '~/lib/queries/sport-equipments'
import { Link } from '@tanstack/react-router'
import { MapPinIcon } from 'lucide-react'
import { BookButton } from '~/components/bookButton'

type SportPlaceItemProps = {
  equipment: SportEquipment
}

export function SportPlaceItem({ equipment }: SportPlaceItemProps) {
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState<boolean>(false)

  const coordUrl =
    equipment.coordonnees?.lat && equipment.coordonnees?.lon
      ? `https://maps.google.com/maps?q=${equipment.coordonnees.lat},${equipment.coordonnees.lon}&hl=fr&z=14&output=embed`
      : equipment.address &&
        equipment.libBdv &&
        `https://maps.google.com/maps?q=${encodeURIComponent(equipment.address + equipment.libBdv + equipment.postalCode)}&hl=fr&z=14&output=embed`

  return (
    <Card className="overflow-hidden justify-items-start flex flex-col sm:flex-row shadow-sm hover:shadow-md transition min-h-80">
      <div className="sm:w-2/3 relative">
        {coordUrl ? (
          <div className="pl-5 w-full h-48 sm:h-full">
            <iframe
              src={coordUrl}
              width="150"
              height="100"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <img
            src={
              equipment.image ||
              'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60'
            }
            alt={equipment.nom}
            className="object-cover h-48 sm:h-full w-full"
          />
        )}

        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold px-3 py-1 rounded-lg shadow-sm text-sm">
          {equipment.type}
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col justify-between px-6 py-3">
        <div className="flex flex-1 items-start flex-col">
          <CardHeader className="p-0 flex w-full mb-2">
            <CardTitle className="text-xl">{equipment.nom}</CardTitle>
          </CardHeader>
          <div className="flex justify-center items-center gap-2 h-full">
            <MapPinIcon className="size-5" />
            <a
              href={coordUrl?.replace('&output=embed', '') || '#'}
              className="link font-normal text-lg text-muted-foreground flex flex-col items-start"
              target="_blank"
              rel="noreferrer"
            >
              <p>{equipment.address}</p>
              <p>
                {equipment.postalCode} {equipment.libBdv}
              </p>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="flex gap-3 mt-5">
          <Link
            to="/equipment/$equipmentId"
            params={{ equipmentId: equipment.id }}
          >
            <Button variant="outline">Voir détails</Button>
          </Link>

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

          {/* Réserver */}
          <BookButton equipment={{ id: equipment.id, nom: equipment.nom }} />
        </div>
      </CardContent>
    </Card>
  )
}
