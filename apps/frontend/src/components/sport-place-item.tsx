import { useState } from 'react'
import { ClaimEstablishmentForm } from '~/components/claim-establishment-form'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { SportEquipment } from '~/lib/queries/sport-equipments'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, ChevronRight, MapPinIcon } from 'lucide-react'
import { BookButton } from '~/components/bookButton'
import { motion } from 'motion/react'
import { Map, MapMarker, MapTileLayer } from '~/components/ui/map'
import type { LatLngExpression } from 'leaflet'

type SportPlaceItemProps = {
  equipment: SportEquipment
  index?: number
}

export function SportPlaceItem({ equipment, index = 0 }: SportPlaceItemProps) {
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState<boolean>(false)

  // Check if we have valid coordinates
  const hasCoordinates =
    equipment.coordonnees?.lat && equipment.coordonnees?.lon

  const center: LatLngExpression | null = hasCoordinates
    ? [equipment.coordonnees!.lat, equipment.coordonnees!.lon]
    : null

  // Google Maps link for external navigation
  const mapsLink = hasCoordinates
    ? `https://maps.google.com/maps?q=${equipment.coordonnees!.lat},${equipment.coordonnees!.lon}`
    : equipment.address && equipment.libBdv
      ? `https://maps.google.com/maps?q=${encodeURIComponent(equipment.address + ' ' + equipment.libBdv + ' ' + equipment.postalCode)}`
      : '#'

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      {/* Main Card Container */}
      <div className="relative bg-card rounded-2xl overflow-hidden border border-border/40 transition-all duration-500 group-hover:border-secondary/50 group-hover:shadow-[0_0_30px_-5px_oklch(0.58_0.22_255_/_0.2)]">
        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-12 gap-0">
          {/* Left Column - Typography & Content */}
          <div className="col-span-12 lg:col-span-7 p-6 lg:p-8 flex flex-col min-h-[280px]">
            {/* Top Row - Type Badge with Editorial Style */}
            <div className="flex items-start justify-between mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 + 0.1 }}
              >
                <span
                  className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-secondary"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {equipment.type}
                </span>
                <div className="mt-1 w-8 h-0.5 bg-secondary rounded-full" />
              </motion.div>

              {/* Issue Number Style Index */}
              <span
                className="text-[10px] font-medium tracking-wider text-muted-foreground/50"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                N°{String(index + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Main Title - Bold Editorial Typography */}
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {equipment.nom}
            </h2>

            {/* Location - Minimal Style */}
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group/loc mb-auto"
            >
              <MapPinIcon className="w-3.5 h-3.5" />
              <span className="group-hover/loc:underline underline-offset-4">
                {equipment.address}, {equipment.postalCode} {equipment.libBdv}
              </span>
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/loc:opacity-100 group-hover/loc:translate-y-0 group-hover/loc:translate-x-0 transition-all duration-200" />
            </a>

            {/* Bottom Actions - Clean Horizontal Layout */}
            <div className="flex items-center gap-3 pt-6 mt-auto border-t border-border/50">
              <Link
                to="/equipment/$equipmentId"
                params={{ equipmentId: equipment.id }}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto group/btn rounded-full px-5 border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Voir détails
                  </span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>

              <BookButton
                equipment={{ id: equipment.id, nom: equipment.nom }}
              />
            </div>
          </div>

          {/* Right Column - Map Accent */}
          <div className="col-span-12 lg:col-span-5 relative">
            {/* Diagonal Separator Line - Desktop Only */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            {/* Map Container with Unique Shape */}
            <div className="relative h-48 lg:h-full lg:min-h-[280px] overflow-hidden">
              {/* Decorative Corner Element */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-secondary/10 to-transparent z-10 hidden lg:block" />

              {center ? (
                <div className="w-full h-full">
                  <Map
                    center={center}
                    zoom={15}
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    className="w-full h-full"
                  >
                    <MapTileLayer />
                    <MapMarker
                      position={center}
                      icon={
                        <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full shadow-lg border-3 border-white">
                          <MapPinIcon className="w-5 h-5 text-white" />
                        </div>
                      }
                      iconAnchor={[20, 20]}
                    />
                  </Map>
                </div>
              ) : (
                <div className="relative w-full h-full overflow-hidden bg-muted">
                  <img
                    src={
                      equipment.image ||
                      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60'
                    }
                    alt={equipment.nom}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              )}

              {/* Floating Index Badge on Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 + 0.2 }}
                className="absolute bottom-4 right-4 z-[500]"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-card flex items-center justify-center shadow-xl border border-border/50">
                  <span
                    className="text-lg font-bold text-foreground"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Dialog */}
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
    </motion.article>
  )
}
