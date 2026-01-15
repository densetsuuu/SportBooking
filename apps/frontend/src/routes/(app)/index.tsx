import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ListView } from '~/components/list-view'
import { getSportEquipmentQueryOptions } from '~/lib/queries/sport-equipments'
import { searchSchema } from '~/lib/schemas/common'
import 'leaflet/dist/leaflet.css'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import { AnimatePresence, motion } from 'motion/react'
import { Calendar, MapPin, Sparkles, Trophy } from 'lucide-react'
import { ViewToggle } from '~/components/view-toggle'
import { MapSearchView } from '~/components/map-search-view'
import { EquipmentCardSkeletonList } from '~/components/skeletons/equipment-card-skeleton'
import type { MapBounds } from '~/components/ui/map'

export const Route = createFileRoute('/(app)/')({
  validateSearch: searchSchema,
  component: App,
})

function App() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate({ from: '/' })
  const {
    name,
    city,
    sport,
    view = 'list',
    minLat,
    maxLat,
    minLon,
    maxLon,
  } = Route.useSearch()

  // State for map bounds (used when in map view)
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(() =>
    minLat !== undefined &&
    maxLat !== undefined &&
    minLon !== undefined &&
    maxLon !== undefined
      ? { minLat, maxLat, minLon, maxLon }
      : null
  )

  const isMapView = view === 'map'
  const limit = isMapView ? 100 : 5

  const { data, isLoading, isFetching } = useQuery(
    getSportEquipmentQueryOptions({
      payload: {
        page: isMapView ? 1 : page,
        limit,
        nom: name || undefined,
        typeSport: sport || undefined,
        ville: city || undefined,
        // Only pass bounds when in map view and bounds are set
        ...(isMapView && mapBounds
          ? {
              minLat: mapBounds.minLat,
              maxLat: mapBounds.maxLat,
              minLon: mapBounds.minLon,
              maxLon: mapBounds.maxLon,
            }
          : {}),
      },
    })
  )

  const handleViewChange = useCallback(
    (newView: 'list' | 'map') => {
      navigate({
        search: prev => ({
          ...prev,
          view: newView,
          // Clear bounds when switching to list view
          ...(newView === 'list'
            ? {
                minLat: undefined,
                maxLat: undefined,
                minLon: undefined,
                maxLon: undefined,
              }
            : {}),
        }),
      })
      // Reset page when switching views
      setPage(1)
    },
    [navigate]
  )

  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setMapBounds(bounds)
    // Don't update URL on every bounds change to avoid re-renders
    // URL is only updated when switching views
  }, [])

  const handleNextPage = () => {
    if (data && page < data.total) {
      setPage(page + 1)
    }
  }
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const totalPages = data ? Math.ceil(data.total / limit) : 1
  const hasFilters = name || city || sport

  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-sport-energy/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Only show when no filters active and in list view */}
      {!hasFilters && !isMapView && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative py-16 md:py-24"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>Trouvez votre terrain idéal</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Réservez vos{' '}
                <span className="text-gradient">équipements sportifs</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              >
                Découvrez et réservez des terrains de sport, gymnases et
                équipements sportifs près de chez vous en quelques clics.
              </motion.p>

              {/* Feature badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-4"
              >
                {[
                  { icon: MapPin, label: 'Géolocalisation' },
                  { icon: Calendar, label: 'Réservation rapide' },
                  { icon: Trophy, label: 'Tous les sports' },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card shadow-sm border border-border/50"
                  >
                    <feature.icon className="w-4 h-4 text-secondary" />
                    <span
                      className="text-sm font-medium"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {feature.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Decorative gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </motion.section>
      )}

      {/* Results Section */}
      <section className="relative py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header with view toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {hasFilters ? (
                  <>
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Résultats de recherche
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {data?.total || 0} équipement
                      {(data?.total || 0) !== 1 ? 's' : ''} trouvé
                      {(data?.total || 0) !== 1 ? 's' : ''}
                      {name && (
                        <span>
                          {' '}
                          pour &quot;
                          <span className="text-secondary">{name}</span>
                          &quot;
                        </span>
                      )}
                      {sport && (
                        <span>
                          {' '}
                          dans &quot;
                          <span className="text-secondary">{sport}</span>
                          &quot;
                        </span>
                      )}
                      {city && (
                        <span>
                          {' '}
                          à &quot;<span className="text-secondary">{city}</span>
                          &quot;
                        </span>
                      )}
                    </p>
                  </>
                ) : isMapView ? (
                  <>
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Explorer la carte
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Déplacez la carte pour découvrir les équipements sportifs
                    </p>
                  </>
                ) : (
                  <>
                    <h2
                      className="text-2xl font-bold mb-1"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      Équipements sportifs
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Parcourez notre sélection d&#39;équipements
                    </p>
                  </>
                )}
              </div>

              {/* View Toggle */}
              <ViewToggle view={view} onChange={handleViewChange} />
            </div>
          </motion.div>

          {/* Content with animated transitions */}
          <AnimatePresence mode="wait">
            {/* List View */}
            {!isMapView && (
              <motion.div
                key="list-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Loading State with Skeletons */}
                {isLoading && <EquipmentCardSkeletonList count={5} />}

                {/* Results List */}
                {!isLoading && data?.data && (
                  <>
                    <ListView results={data.data} />

                    {/* Pagination */}
                    {data.total > limit && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-10"
                      >
                        <Pagination>
                          <PaginationContent className="gap-2">
                            <PaginationItem>
                              <PaginationPrevious
                                disabled={page === 1}
                                onClick={handlePreviousPage}
                                className="rounded-xl hover:bg-secondary/10 hover:text-secondary transition-colors disabled:opacity-40"
                              />
                            </PaginationItem>

                            {/* Show page numbers */}
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                let pageNum: number
                                if (totalPages <= 5) {
                                  pageNum = i + 1
                                } else if (page <= 3) {
                                  pageNum = i + 1
                                } else if (page >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i
                                } else {
                                  pageNum = page - 2 + i
                                }
                                return (
                                  <PaginationItem key={pageNum}>
                                    <PaginationLink
                                      onClick={() => setPage(pageNum)}
                                      isActive={page === pageNum}
                                      className={`rounded-xl transition-all ${
                                        page === pageNum
                                          ? 'bg-secondary text-white shadow-lg shadow-secondary/25'
                                          : 'hover:bg-secondary/10 hover:text-secondary'
                                      }`}
                                    >
                                      {pageNum}
                                    </PaginationLink>
                                  </PaginationItem>
                                )
                              }
                            )}

                            <PaginationItem>
                              <PaginationNext
                                disabled={page === totalPages}
                                onClick={handleNextPage}
                                className="rounded-xl hover:bg-secondary/10 hover:text-secondary transition-colors disabled:opacity-40"
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>

                        {/* Page indicator */}
                        <p className="text-center text-sm text-muted-foreground mt-4">
                          Page {page} sur {totalPages}
                        </p>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* Map View */}
            {isMapView && (
              <motion.div
                key="map-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto"
              >
                {/* Always render MapSearchView to prevent remounting, show skeleton overlay when loading */}
                <MapSearchView
                  equipments={data?.data || []}
                  isLoading={isLoading || isFetching}
                  totalCount={data?.total || 0}
                  onBoundsChange={handleBoundsChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
