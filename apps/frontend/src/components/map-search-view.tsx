import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { ChevronRight, Loader2, MapPinIcon } from 'lucide-react'
import {
  Map,
  type MapBounds,
  MapBoundsHandler,
  MapLocateControl,
  MapMarker,
  MapMarkerClusterGroup,
  MapPopup,
  MapTileLayer,
  MapZoomControl,
} from '~/components/ui/map'
import { Button } from '~/components/ui/button'
import { MapSkeleton } from '~/components/skeletons/map-skeleton'
import { BookButton } from '~/components/bookButton'
import { SportEquipment } from '~/lib/queries/sport-equipments'
import type { LatLngExpression } from 'leaflet'

type MapSearchViewProps = {
  equipments: SportEquipment[]
  isLoading: boolean
  totalCount: number
  onBoundsChange: (bounds: MapBounds) => void
  initialCenter?: LatLngExpression
}

export function MapSearchView({
  equipments,
  isLoading,
  totalCount,
  onBoundsChange,
  initialCenter = [46.603354, 1.888334], // Center of France
}: MapSearchViewProps) {
  // Use ref to keep callback stable
  const onBoundsChangeRef = useRef(onBoundsChange)
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange
  }, [onBoundsChange])

  // Debounce bounds change to avoid too many API calls
  const debouncedBoundsChange = useDebouncedCallback((bounds: MapBounds) => {
    onBoundsChangeRef.current(bounds)
  }, 1000)

  // Stable callback that won't change reference
  const handleBoundsChange = useCallback(
    (bounds: MapBounds) => {
      debouncedBoundsChange(bounds)
    },
    [debouncedBoundsChange]
  )

  // Cluster icon renderer
  const clusterIcon = useCallback(
    (count: number) => (
      <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full shadow-lg border-3 border-white text-white font-bold text-sm">
        {count > 99 ? '99+' : count}
      </div>
    ),
    []
  )

  // Filter equipments with valid coordinates
  const validEquipments = useMemo(
    () => equipments.filter(e => e.coordonnees?.lat && e.coordonnees?.lon),
    [equipments]
  )

  return (
    <div className="relative w-full h-[calc(100vh-180px)] min-h-[500px] rounded-2xl overflow-hidden border border-border/40 shadow-xl isolate">
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm z-[1000] flex items-center justify-center"
          >
            <div className="flex items-center gap-3 px-5 py-3 bg-card rounded-full shadow-lg border border-border/50">
              <Loader2 className="w-5 h-5 animate-spin text-secondary" />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Chargement...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]"
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-card/95 backdrop-blur-sm rounded-full shadow-lg border border-border/50">
          <MapPinIcon className="w-4 h-4 text-secondary" />
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {totalCount} équipement{totalCount !== 1 ? 's' : ''}
          </span>
          <span className="text-xs text-muted-foreground">dans cette zone</span>
        </div>
      </motion.div>

      {/* Map Container - key ensures stable mount */}
      <Map
        key="map-search-container"
        center={initialCenter}
        zoom={6}
        className="w-full h-full rounded-none"
      >
        <MapTileLayer />
        <MapBoundsHandler onBoundsChange={handleBoundsChange} />
        <MapZoomControl className="top-16 left-4" />
        <MapLocateControl className="bottom-4 left-4" />

        {/* Marker Cluster Group */}
        <MapMarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          spiderfyOnMaxZoom
          icon={clusterIcon}
        >
          {validEquipments.map(equipment => (
            <MapMarker
              key={equipment.id}
              position={[
                equipment.coordonnees!.lat,
                equipment.coordonnees!.lon,
              ]}
              icon={
                <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-3 border-white bg-secondary hover:scale-110 transition-transform duration-200">
                  <MapPinIcon className="w-5 h-5 text-white" />
                </div>
              }
              iconAnchor={[20, 20]}
            >
              <MapPopup>
                <div className="w-80 bg-card rounded-xl shadow-2xl border border-border/50 overflow-hidden">
                  <EquipmentPopupCard equipment={equipment} />
                </div>
              </MapPopup>
            </MapMarker>
          ))}
        </MapMarkerClusterGroup>
      </Map>
    </div>
  )
}

function EquipmentPopupCard({ equipment }: { equipment: SportEquipment }) {
  return (
    <div className="bg-card">
      {/* Header */}
      <div className="relative p-4 pb-2">
        {/* Type badge */}
        <span
          className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase text-secondary mb-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {equipment.type}
        </span>

        {/* Title */}
        <h3
          className="text-lg font-bold leading-tight pr-6 line-clamp-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {equipment.nom}
        </h3>

        {/* Location */}
        <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
          <MapPinIcon className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            {equipment.address}, {equipment.postalCode} {equipment.libBdv}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 p-4 pt-2 border-t border-border/50">
        <Link
          to="/equipment/$equipmentId"
          params={{ equipmentId: equipment.id }}
          className="flex-1 min-w-0"
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full text-xs"
          >
            Détails
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <BookButton
            equipment={{ id: equipment.id, nom: equipment.nom }}
            size="sm"
            className="w-full rounded-full text-xs"
            label="Réserver"
          />
        </div>
      </div>
    </div>
  )
}

export { MapSkeleton }
