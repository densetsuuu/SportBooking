'use client'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { ButtonGroup } from '~/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  PlaceAutocomplete,
  type PlaceAutocompleteProps,
} from '~/components/ui/place-autocomplete'
import type { CheckboxItem } from '@radix-ui/react-dropdown-menu'
import type {
  Circle,
  CircleMarker,
  DivIconOptions,
  Draw,
  DrawEvents,
  DrawMap,
  DrawOptions,
  EditToolbar,
  ErrorEvent,
  FeatureGroup,
  LatLngExpression,
  LayerGroup,
  LocateOptions,
  LocationEvent,
  Map as LeafletMap,
  Marker,
  MarkerCluster,
  PointExpression,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
  Tooltip,
} from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import {
  CircleIcon,
  LayersIcon,
  LoaderCircleIcon,
  MapPinIcon,
  MinusIcon,
  NavigationIcon,
  PenLineIcon,
  PentagonIcon,
  PlusIcon,
  SquareIcon,
  Trash2Icon,
  Undo2Icon,
  WaypointsIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { renderToString } from 'react-dom/server'
import type {
  CircleMarkerProps,
  CircleProps,
  FeatureGroupProps,
  LayerGroupProps,
  MapContainerProps,
  MarkerProps,
  PolygonProps,
  PolylineProps,
  PopupProps,
  RectangleProps,
  TileLayerProps,
  TooltipProps,
} from 'react-leaflet'
import type { MarkerClusterGroupProps } from 'react-leaflet-markercluster'
import 'react-leaflet-markercluster/styles'

// Dynamic imports for react-leaflet to handle React 19 compatibility
let ReactLeaflet: typeof import('react-leaflet') | null = null
let MarkerClusterGroup:
  | typeof import('react-leaflet-markercluster').default
  | null = null

// Load react-leaflet dynamically
if (typeof window !== 'undefined') {
  import('react-leaflet').then(module => {
    ReactLeaflet = module
  })
  import('react-leaflet-markercluster').then(module => {
    MarkerClusterGroup = module.default
  })
}

// Hook to get react-leaflet when loaded
function useReactLeaflet() {
  const [loaded, setLoaded] = useState(ReactLeaflet !== null)

  useEffect(() => {
    if (ReactLeaflet) {
      setLoaded(true)
      return
    }

    import('react-leaflet').then(module => {
      ReactLeaflet = module
      setLoaded(true)
    })
  }, [])

  return loaded ? ReactLeaflet : null
}

function useMarkerCluster() {
  const [loaded, setLoaded] = useState(MarkerClusterGroup !== null)

  useEffect(() => {
    if (MarkerClusterGroup) {
      setLoaded(true)
      return
    }

    import('react-leaflet-markercluster').then(module => {
      MarkerClusterGroup = module.default
      setLoaded(true)
    })
  }, [])

  return loaded ? MarkerClusterGroup : null
}

function Map({
  zoom = 15,
  maxZoom = 18,
  className,
  children,
  ...props
}: Omit<MapContainerProps, 'zoomControl'> & {
  center: LatLngExpression
  children?: ReactNode
}) {
  const RL = useReactLeaflet()

  if (!RL) {
    return (
      <div
        className={cn(
          'z-50 size-full min-h-96 flex-1 rounded-md bg-muted flex items-center justify-center',
          className
        )}
      >
        <LoaderCircleIcon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <RL.MapContainer
      zoom={zoom}
      maxZoom={maxZoom}
      attributionControl={false}
      zoomControl={false}
      className={cn('z-50 size-full min-h-96 flex-1 rounded-md', className)}
      {...props}
    >
      {children}
    </RL.MapContainer>
  )
}

interface MapTileLayerOption {
  name: string
  url: string
  attribution?: string
}

interface MapLayerGroupOption
  extends Pick<React.ComponentProps<typeof CheckboxItem>, 'disabled'> {
  name: string
}

interface MapLayersContextType {
  registerTileLayer: (layer: MapTileLayerOption) => void
  tileLayers: MapTileLayerOption[]
  selectedTileLayer: string
  setSelectedTileLayer: (name: string) => void
  registerLayerGroup: (layer: MapLayerGroupOption) => void
  layerGroups: MapLayerGroupOption[]
  activeLayerGroups: string[]
  setActiveLayerGroups: (names: string[]) => void
}

const MapLayersContext = createContext<MapLayersContextType | null>(null)

function useMapLayersContext() {
  return useContext(MapLayersContext)
}

// Internal hook for components that need useMap
function useMapInternal() {
  const RL = useReactLeaflet()
  if (!RL) return null
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return RL.useMap()
}

// Internal hook for components that need useMapEvents
function useMapEventsInternal(
  handlers: Parameters<typeof import('react-leaflet').useMapEvents>[0]
) {
  const RL = useReactLeaflet()
  if (!RL) return null
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return RL.useMapEvents(handlers)
}

function MapTileLayerInner({
  name = 'Default',
  url,
  attribution,
  darkUrl,
  darkAttribution,
  ...props
}: Partial<TileLayerProps> & {
  name?: string
  darkUrl?: string
  darkAttribution?: string
}) {
  const RL = useReactLeaflet()
  const map = RL?.useMap()

  if (!RL || !map) return null

  if (map.attributionControl) {
    map.attributionControl.setPrefix('')
  }

  const context = useContext(MapLayersContext)
  const DEFAULT_URL =
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
  const DEFAULT_DARK_URL =
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'

  const { resolvedTheme } = useTheme()
  const resolvedUrl =
    resolvedTheme === 'dark'
      ? (darkUrl ?? url ?? DEFAULT_DARK_URL)
      : (url ?? DEFAULT_URL)
  const resolvedAttribution =
    resolvedTheme === 'dark' && darkAttribution
      ? darkAttribution
      : (attribution ??
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>')

  useEffect(() => {
    if (context) {
      context.registerTileLayer({
        name,
        url: resolvedUrl,
        attribution: resolvedAttribution,
      })
    }
  }, [context, name, url, attribution])

  if (context && context.selectedTileLayer !== name) {
    return null
  }

  return (
    <RL.TileLayer
      url={resolvedUrl}
      attribution={resolvedAttribution}
      {...props}
    />
  )
}

function MapTileLayer(
  props: Partial<TileLayerProps> & {
    name?: string
    darkUrl?: string
    darkAttribution?: string
  }
) {
  return <MapTileLayerInner {...props} />
}

function MapLayerGroupInner({
  name,
  disabled,
  ...props
}: LayerGroupProps & MapLayerGroupOption) {
  const RL = useReactLeaflet()
  const context = useMapLayersContext()

  useEffect(() => {
    if (context) {
      context.registerLayerGroup({
        name,
        disabled,
      })
    }
  }, [context, name, disabled])

  if (!RL) return null

  if (context && !context.activeLayerGroups.includes(name)) {
    return null
  }

  return <RL.LayerGroup {...props} />
}

function MapLayerGroup(props: LayerGroupProps & MapLayerGroupOption) {
  return <MapLayerGroupInner {...props} />
}

function MapFeatureGroupInner({
  name,
  disabled,
  ...props
}: FeatureGroupProps & MapLayerGroupOption) {
  const RL = useReactLeaflet()
  const context = useMapLayersContext()

  useEffect(() => {
    if (context) {
      context.registerLayerGroup({
        name,
        disabled,
      })
    }
  }, [context, name, disabled])

  if (!RL) return null

  if (context && !context.activeLayerGroups.includes(name)) {
    return null
  }

  return <RL.FeatureGroup {...props} />
}

function MapFeatureGroup(props: FeatureGroupProps & MapLayerGroupOption) {
  return <MapFeatureGroupInner {...props} />
}

function MapLayers({
  defaultTileLayer,
  defaultLayerGroups = [],
  ...props
}: Omit<React.ComponentProps<typeof MapLayersContext.Provider>, 'value'> & {
  defaultTileLayer?: string
  defaultLayerGroups?: string[]
}) {
  const [tileLayers, setTileLayers] = useState<MapTileLayerOption[]>([])
  const [selectedTileLayer, setSelectedTileLayer] = useState<string>(
    defaultTileLayer || ''
  )
  const [layerGroups, setLayerGroups] = useState<MapLayerGroupOption[]>([])
  const [activeLayerGroups, setActiveLayerGroups] =
    useState<string[]>(defaultLayerGroups)

  function registerTileLayer(tileLayer: MapTileLayerOption) {
    setTileLayers(prevTileLayers => {
      if (prevTileLayers.some(layer => layer.name === tileLayer.name)) {
        return prevTileLayers
      }
      return [...prevTileLayers, tileLayer]
    })
  }

  function registerLayerGroup(layerGroup: MapLayerGroupOption) {
    setLayerGroups(prevLayerGroups => {
      if (prevLayerGroups.some(group => group.name === layerGroup.name)) {
        return prevLayerGroups
      }
      return [...prevLayerGroups, layerGroup]
    })
  }

  useEffect(() => {
    // Error: Invalid defaultValue
    if (
      defaultTileLayer &&
      tileLayers.length > 0 &&
      !tileLayers.some(tileLayer => tileLayer.name === defaultTileLayer)
    ) {
      throw new Error(
        `Invalid defaultTileLayer "${defaultTileLayer}" provided to MapLayers. It must match a MapTileLayer's name prop.`
      )
    }

    // Set initial selected tile layer
    if (tileLayers.length > 0 && !selectedTileLayer) {
      const validDefaultValue =
        defaultTileLayer &&
        tileLayers.some(layer => layer.name === defaultTileLayer)
          ? defaultTileLayer
          : tileLayers[0].name
      setSelectedTileLayer(validDefaultValue)
    }

    // Error: Invalid defaultActiveLayerGroups
    if (
      defaultLayerGroups.length > 0 &&
      layerGroups.length > 0 &&
      defaultLayerGroups.some(
        name => !layerGroups.some(group => group.name === name)
      )
    ) {
      throw new Error(
        `Invalid defaultLayerGroups value provided to MapLayers. All names must match a MapLayerGroup's name prop.`
      )
    }
  }, [
    tileLayers,
    defaultTileLayer,
    selectedTileLayer,
    layerGroups,
    defaultLayerGroups,
  ])

  return (
    <MapLayersContext.Provider
      value={{
        registerTileLayer,
        tileLayers,
        selectedTileLayer,
        setSelectedTileLayer,
        registerLayerGroup,
        layerGroups,
        activeLayerGroups,
        setActiveLayerGroups,
      }}
      {...props}
    />
  )
}

function MapLayersControl({
  tileLayersLabel = 'Map Type',
  layerGroupsLabel = 'Layers',
  className,
  ...props
}: React.ComponentProps<'button'> & {
  tileLayersLabel?: string
  layerGroupsLabel?: string
}) {
  const layersContext = useMapLayersContext()
  if (!layersContext) {
    throw new Error('MapLayersControl must be used within MapLayers')
  }

  const {
    tileLayers,
    selectedTileLayer,
    setSelectedTileLayer,
    layerGroups,
    activeLayerGroups,
    setActiveLayerGroups,
  } = layersContext

  if (tileLayers.length === 0 && layerGroups.length === 0) {
    return null
  }

  function handleLayerGroupToggle(name: string, checked: boolean) {
    setActiveLayerGroups(
      checked
        ? [...activeLayerGroups, name]
        : activeLayerGroups.filter(groupName => groupName !== name)
    )
  }

  const showTileLayersDropdown = tileLayers.length > 1
  const showLayerGroupsDropdown = layerGroups.length > 0

  if (!showTileLayersDropdown && !showLayerGroupsDropdown) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Select layers"
          title="Select layers"
          className={cn('absolute top-1 right-1 z-1000 border', className)}
          {...props}
        >
          <LayersIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-1000">
        {showTileLayersDropdown && (
          <>
            <DropdownMenuLabel>{tileLayersLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={selectedTileLayer}
              onValueChange={setSelectedTileLayer}
            >
              {tileLayers.map(tileLayer => (
                <DropdownMenuRadioItem
                  key={tileLayer.name}
                  value={tileLayer.name}
                >
                  {tileLayer.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
        {showTileLayersDropdown && showLayerGroupsDropdown && (
          <DropdownMenuSeparator />
        )}
        {showLayerGroupsDropdown && (
          <>
            <DropdownMenuLabel>{layerGroupsLabel}</DropdownMenuLabel>
            {layerGroups.map(layerGroup => (
              <DropdownMenuCheckboxItem
                key={layerGroup.name}
                checked={activeLayerGroups.includes(layerGroup.name)}
                disabled={layerGroup.disabled}
                onCheckedChange={checked =>
                  handleLayerGroupToggle(layerGroup.name, checked)
                }
              >
                {layerGroup.name}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MapMarkerInner({
  icon = <MapPinIcon className="size-6" />,
  iconAnchor = [12, 12],
  bgPos,
  popupAnchor = [0, -10],
  tooltipAnchor,
  ...props
}: Omit<MarkerProps, 'icon'> &
  Pick<
    DivIconOptions,
    'iconAnchor' | 'bgPos' | 'popupAnchor' | 'tooltipAnchor'
  > & {
    icon?: ReactNode
  }) {
  const RL = useReactLeaflet()
  const { L } = useLeaflet()

  if (!L || !RL) return null

  return (
    <RL.Marker
      icon={L.divIcon({
        html: renderToString(icon),
        className: 'leaflet-marker-icon-custom',
        iconAnchor,
        popupAnchor,
        ...(bgPos ? { bgPos } : {}),
        ...(tooltipAnchor ? { tooltipAnchor } : {}),
      })}
      riseOnHover
      {...props}
    />
  )
}

function MapMarker(
  props: Omit<MarkerProps, 'icon'> &
    Pick<
      DivIconOptions,
      'iconAnchor' | 'bgPos' | 'popupAnchor' | 'tooltipAnchor'
    > & {
      icon?: ReactNode
    }
) {
  return <MapMarkerInner {...props} />
}

function MapMarkerClusterGroupInner({
  polygonOptions = {
    className: 'fill-foreground stroke-foreground stroke-2',
  },
  spiderLegPolylineOptions = {
    className: 'fill-foreground stroke-foreground stroke-2',
  },
  icon,
  ...props
}: Omit<MarkerClusterGroupProps, 'iconCreateFunction'> & {
  children: ReactNode
  icon?: (markerCount: number) => ReactNode
}) {
  const { L } = useLeaflet()
  const LeafletMarkerClusterGroup = useMarkerCluster()
  if (!L || !LeafletMarkerClusterGroup) return null

  const iconCreateFunction = icon
    ? (cluster: MarkerCluster) => {
        const markerCount = cluster.getChildCount()
        const iconNode = icon(markerCount)
        return L.divIcon({
          html: renderToString(iconNode),
        })
      }
    : undefined

  return (
    <LeafletMarkerClusterGroup
      polygonOptions={polygonOptions}
      spiderLegPolylineOptions={spiderLegPolylineOptions}
      iconCreateFunction={iconCreateFunction}
      {...props}
    />
  )
}

function MapMarkerClusterGroup(
  props: Omit<MarkerClusterGroupProps, 'iconCreateFunction'> & {
    children: ReactNode
    icon?: (markerCount: number) => ReactNode
  }
) {
  return <MapMarkerClusterGroupInner {...props} />
}

function MapCircleInner({ className, ...props }: CircleProps) {
  const RL = useReactLeaflet()
  if (!RL) return null

  return (
    <RL.Circle
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapCircle(props: CircleProps) {
  return <MapCircleInner {...props} />
}

function MapCircleMarkerInner({ className, ...props }: CircleMarkerProps) {
  const RL = useReactLeaflet()
  if (!RL) return null

  return (
    <RL.CircleMarker
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapCircleMarker(props: CircleMarkerProps) {
  return <MapCircleMarkerInner {...props} />
}

function MapPolylineInner({ className, ...props }: PolylineProps) {
  const RL = useReactLeaflet()
  if (!RL) return null

  return (
    <RL.Polyline
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapPolyline(props: PolylineProps) {
  return <MapPolylineInner {...props} />
}

function MapPolygonInner({ className, ...props }: PolygonProps) {
  const RL = useReactLeaflet()
  if (!RL) return null

  return (
    <RL.Polygon
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapPolygon(props: PolygonProps) {
  return <MapPolygonInner {...props} />
}

function MapRectangleInner({ className, ...props }: RectangleProps) {
  const RL = useReactLeaflet()
  if (!RL) return null

  return (
    <RL.Rectangle
      className={cn('fill-foreground stroke-foreground stroke-2', className)}
      {...props}
    />
  )
}

function MapRectangle(props: RectangleProps) {
  return <MapRectangleInner {...props} />
}

function MapPopupInner({
  className,
  closeButton = false,
  eventHandlers,
  ...props
}: Omit<PopupProps, 'content'> & {
  eventHandlers?: {
    add?: () => void
    remove?: () => void
  }
}) {
  const RL = useReactLeaflet()
  if (!RL) return null

  return (
    <RL.Popup
      className={cn(
        '[&_.leaflet-popup-content-wrapper]:bg-transparent [&_.leaflet-popup-content-wrapper]:shadow-none [&_.leaflet-popup-content-wrapper]:rounded-none [&_.leaflet-popup-content-wrapper]:p-0 [&_.leaflet-popup-content]:m-0 [&_.leaflet-popup-content]:p-0 [&_.leaflet-popup-tip-container]:hidden',
        'font-sans',
        className
      )}
      closeButton={closeButton}
      eventHandlers={eventHandlers}
      {...props}
    />
  )
}

function MapPopup(
  props: Omit<PopupProps, 'content'> & {
    eventHandlers?: {
      add?: () => void
      remove?: () => void
    }
  }
) {
  return <MapPopupInner {...props} />
}

function MapTooltipInner({
  className,
  children,
  side = 'top',
  sideOffset = 15,
  ...props
}: Omit<TooltipProps, 'offset'> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}) {
  const RL = useReactLeaflet()
  if (!RL) return null

  const ARROW_POSITION_CLASSES = {
    top: 'bottom-0.5 left-1/2 -translate-x-1/2 translate-y-1/2',
    bottom: 'top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2',
    left: 'right-0.5 top-1/2 translate-x-1/2 -translate-y-1/2',
    right: 'left-0.5 top-1/2 -translate-x-1/2 -translate-y-1/2',
  }
  const DEFAULT_OFFSET = {
    top: [0, -sideOffset] satisfies PointExpression,
    bottom: [0, sideOffset] satisfies PointExpression,
    left: [-sideOffset, 0] satisfies PointExpression,
    right: [sideOffset, 0] satisfies PointExpression,
  }

  return (
    <RL.Tooltip
      className={cn(
        'animate-in fade-in-0 zoom-in-95 fade-out-0 zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-fit text-xs text-balance transition-opacity',
        className
      )}
      data-side={side}
      direction={side}
      offset={DEFAULT_OFFSET[side]}
      opacity={1}
      {...props}
    >
      {children}
      <div
        className={cn(
          'bg-foreground fill-foreground absolute z-50 size-2.5 rotate-45 rounded-[2px]',
          ARROW_POSITION_CLASSES[side]
        )}
      />
    </RL.Tooltip>
  )
}

function MapTooltip(
  props: Omit<TooltipProps, 'offset'> & {
    side?: 'top' | 'right' | 'bottom' | 'left'
    sideOffset?: number
  }
) {
  return <MapTooltipInner {...props} />
}

function MapZoomControlInner({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const RL = useReactLeaflet()
  const map = RL?.useMap()
  const [zoomLevel, setZoomLevel] = useState(map?.getZoom() ?? 15)

  useEffect(() => {
    if (!map) return

    const handleZoomEnd = () => {
      setZoomLevel(map.getZoom())
    }

    map.on('zoomend', handleZoomEnd)
    return () => {
      map.off('zoomend', handleZoomEnd)
    }
  }, [map])

  if (!RL || !map) return null

  return (
    <MapControlContainer className={cn('top-1 left-1', className)}>
      <ButtonGroup orientation="vertical" aria-label="Zoom controls" {...props}>
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          aria-label="Zoom in"
          title="Zoom in"
          className="border"
          disabled={zoomLevel >= map.getMaxZoom()}
          onClick={() => map.zoomIn()}
        >
          <PlusIcon />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          aria-label="Zoom out"
          title="Zoom out"
          className="border"
          disabled={zoomLevel <= map.getMinZoom()}
          onClick={() => map.zoomOut()}
        >
          <MinusIcon />
        </Button>
      </ButtonGroup>
    </MapControlContainer>
  )
}

function MapZoomControl(props: React.ComponentProps<'div'>) {
  return <MapZoomControlInner {...props} />
}

function MapLocatePulseIcon() {
  return (
    <div className="absolute -top-1 -right-1 flex size-3 rounded-full">
      <div className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
      <div className="bg-primary relative inline-flex size-3 rounded-full" />
    </div>
  )
}

function MapLocateControlInner({
  className,
  watch = false,
  onLocationFound,
  onLocationError,
  ...props
}: React.ComponentProps<'button'> &
  Pick<LocateOptions, 'watch'> & {
    onLocationFound?: (location: LocationEvent) => void
    onLocationError?: (error: ErrorEvent) => void
  }) {
  const RL = useReactLeaflet()
  const map = RL?.useMap()
  const [isLocating, setIsLocating] = useDebounceLoadingState(200)
  const [position, setPosition] = useState<LatLngExpression | null>(null)

  function startLocating() {
    if (!map) return
    setIsLocating(true)
    map.locate({ setView: true, maxZoom: map.getMaxZoom(), watch })
    map.on('locationfound', (location: LocationEvent) => {
      setPosition(location.latlng)
      setIsLocating(false)
      onLocationFound?.(location)
    })
    map.on('locationerror', (error: ErrorEvent) => {
      setPosition(null)
      setIsLocating(false)
      onLocationError?.(error)
    })
  }

  function stopLocating() {
    if (!map) return
    map.stopLocate()
    map.off('locationfound')
    map.off('locationerror')
    setPosition(null)
    setIsLocating(false)
  }

  useEffect(() => () => stopLocating(), [])

  if (!RL || !map) return null

  return (
    <MapControlContainer className={cn('right-1 bottom-1', className)}>
      <Button
        type="button"
        size="icon-sm"
        variant={position ? 'default' : 'secondary'}
        onClick={position ? stopLocating : startLocating}
        disabled={isLocating}
        title={
          isLocating
            ? 'Locating...'
            : position
              ? 'Stop tracking'
              : 'Track location'
        }
        aria-label={
          isLocating
            ? 'Locating...'
            : position
              ? 'Stop location tracking'
              : 'Start location tracking'
        }
        className="border"
        {...props}
      >
        {isLocating ? (
          <LoaderCircleIcon className="animate-spin" />
        ) : (
          <NavigationIcon />
        )}
      </Button>
      {position && (
        <MapMarker position={position} icon={<MapLocatePulseIcon />} />
      )}
    </MapControlContainer>
  )
}

function MapLocateControl(
  props: React.ComponentProps<'button'> &
    Pick<LocateOptions, 'watch'> & {
      onLocationFound?: (location: LocationEvent) => void
      onLocationError?: (error: ErrorEvent) => void
    }
) {
  return <MapLocateControlInner {...props} />
}

function MapSearchControl({ className, ...props }: PlaceAutocompleteProps) {
  return (
    <MapControlContainer className={cn('top-1 left-1 z-1001 w-60', className)}>
      <PlaceAutocomplete {...props} />
    </MapControlContainer>
  )
}

type MapDrawShape = 'marker' | 'polyline' | 'circle' | 'rectangle' | 'polygon'
type MapDrawAction = 'edit' | 'delete'
type MapDrawMode = MapDrawShape | MapDrawAction | null
interface MapDrawContextType {
  readonly featureGroup: L.FeatureGroup | null
  activeMode: MapDrawMode
  setActiveMode: (mode: MapDrawMode) => void
  readonly editControlRef: React.RefObject<EditToolbar.Edit | null>
  readonly deleteControlRef: React.RefObject<EditToolbar.Delete | null>
}

const MapDrawContext = createContext<MapDrawContextType | null>(null)

function useMapDrawContext() {
  return useContext(MapDrawContext)
}

function MapDrawControl({
  className,
  onLayersChange,
  ...props
}: React.ComponentProps<'div'> & {
  onLayersChange?: (layers: L.FeatureGroup) => void
}) {
  const RL = useReactLeaflet()
  const { L, LeafletDraw } = useLeaflet()
  const map = RL?.useMap()
  const featureGroupRef = useRef<L.FeatureGroup | null>(null)
  const editControlRef = useRef<EditToolbar.Edit | null>(null)
  const deleteControlRef = useRef<EditToolbar.Delete | null>(null)
  const [activeMode, setActiveMode] = useState<MapDrawMode>(null)

  function handleDrawCreated(event: DrawEvents.Created) {
    if (!featureGroupRef.current) return
    const { layer } = event
    featureGroupRef.current.addLayer(layer)
    onLayersChange?.(featureGroupRef.current)
    setActiveMode(null)
  }

  function handleDrawEditedOrDeleted() {
    if (!featureGroupRef.current) return
    onLayersChange?.(featureGroupRef.current)
    setActiveMode(null)
  }

  useEffect(() => {
    if (!L || !LeafletDraw || !map) return

    map.on(L.Draw.Event.CREATED, handleDrawCreated as L.LeafletEventHandlerFn)
    map.on(L.Draw.Event.EDITED, handleDrawEditedOrDeleted)
    map.on(L.Draw.Event.DELETED, handleDrawEditedOrDeleted)

    return () => {
      map.off(
        L.Draw.Event.CREATED,
        handleDrawCreated as L.LeafletEventHandlerFn
      )
      map.off(L.Draw.Event.EDITED, handleDrawEditedOrDeleted)
      map.off(L.Draw.Event.DELETED, handleDrawEditedOrDeleted)
    }
  }, [L, LeafletDraw, map, onLayersChange])

  if (!RL) return null

  return (
    <MapDrawContext.Provider
      value={{
        featureGroup: featureGroupRef.current,
        activeMode,
        setActiveMode,
        editControlRef,
        deleteControlRef,
      }}
    >
      <RL.FeatureGroup ref={featureGroupRef} />
      <MapControlContainer className={cn('bottom-1 left-1', className)}>
        <ButtonGroup orientation="vertical" {...props} />
      </MapControlContainer>
    </MapDrawContext.Provider>
  )
}

function MapDrawShapeButton<T extends Draw.Feature>({
  drawMode,
  createDrawTool,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  drawMode: MapDrawShape
  createDrawTool: (L: typeof import('leaflet'), map: DrawMap) => T
}) {
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error('MapDrawShapeButton must be used within MapDrawControl')
  }
  const RL = useReactLeaflet()
  const { L } = useLeaflet()
  const map = RL?.useMap()
  const controlRef = useRef<T | null>(null)
  const { activeMode, setActiveMode } = drawContext
  const isActive = activeMode === drawMode

  useEffect(() => {
    if (!L || !map || !isActive) {
      controlRef.current?.disable()
      controlRef.current = null
      return
    }
    const control = createDrawTool(L, map as DrawMap)
    control.enable()
    controlRef.current = control
    return () => {
      control.disable()
      controlRef.current = null
    }
  }, [L, map, isActive, createDrawTool])

  function handleClick() {
    setActiveMode(isActive ? null : drawMode)
  }

  return (
    <Button
      type="button"
      size="icon-sm"
      aria-label={`Draw ${drawMode}`}
      title={`Draw ${drawMode}`}
      className={cn('border', className)}
      variant={isActive ? 'default' : 'secondary'}
      disabled={activeMode === 'edit' || activeMode === 'delete'}
      onClick={handleClick}
      {...props}
    />
  )
}

function MapDrawMarker({ ...props }: DrawOptions.MarkerOptions) {
  return (
    <MapDrawShapeButton
      drawMode="marker"
      createDrawTool={(L, map) =>
        new L.Draw.Marker(map, {
          icon: L.divIcon({
            className: '', // For fixing the moving bug when going in and out the edit mode
            iconAnchor: [12, 12],
            html: renderToString(<MapPinIcon className="size-6" />),
          }),
          ...props,
        })
      }
    >
      <MapPinIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawPolyline({
  showLength = false,
  drawError = {
    color: 'var(--color-destructive)',
  },
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.PolylineOptions) {
  const mapDrawHandleIcon = useMapDrawHandleIcon()

  return (
    <MapDrawShapeButton
      drawMode="polyline"
      createDrawTool={(L, map) =>
        new L.Draw.Polyline(map, {
          ...(mapDrawHandleIcon
            ? {
                icon: mapDrawHandleIcon,
                touchIcon: mapDrawHandleIcon,
              }
            : {}),
          showLength,
          drawError,
          shapeOptions,
          ...props,
        })
      }
    >
      <WaypointsIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawCircle({
  showRadius = false,
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.CircleOptions) {
  return (
    <MapDrawShapeButton
      drawMode="circle"
      createDrawTool={(L, map) =>
        new L.Draw.Circle(map, {
          showRadius,
          shapeOptions,
          ...props,
        })
      }
    >
      <CircleIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawRectangle({
  showArea = false,
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.RectangleOptions) {
  return (
    <MapDrawShapeButton
      drawMode="rectangle"
      createDrawTool={(L, map) =>
        new L.Draw.Rectangle(map, {
          showArea,
          shapeOptions,
          ...props,
        })
      }
    >
      <SquareIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawPolygon({
  drawError = {
    color: 'var(--color-destructive)',
  },
  shapeOptions = {
    color: 'var(--color-primary)',
    opacity: 1,
    weight: 2,
  },
  ...props
}: DrawOptions.PolygonOptions) {
  const mapDrawHandleIcon = useMapDrawHandleIcon()

  return (
    <MapDrawShapeButton
      drawMode="polygon"
      createDrawTool={(L, map) =>
        new L.Draw.Polygon(map, {
          ...(mapDrawHandleIcon
            ? {
                icon: mapDrawHandleIcon,
                touchIcon: mapDrawHandleIcon,
              }
            : {}),
          drawError,
          shapeOptions,
          ...props,
        })
      }
    >
      <PentagonIcon />
    </MapDrawShapeButton>
  )
}

function MapDrawActionButton<T extends EditToolbar.Edit | EditToolbar.Delete>({
  drawAction,
  createDrawTool,
  controlRef,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  drawAction: MapDrawAction
  createDrawTool: (
    L: typeof import('leaflet'),
    map: DrawMap,
    featureGroup: L.FeatureGroup
  ) => T
  controlRef: React.RefObject<T | null>
}) {
  const drawContext = useMapDrawContext()
  if (!drawContext)
    throw new Error('MapDrawActionButton must be used within MapDrawControl')

  const RL = useReactLeaflet()
  const { L } = useLeaflet()
  const map = RL?.useMap()
  const { featureGroup, activeMode, setActiveMode } = drawContext
  const isActive = activeMode === drawAction
  const hasFeatures = featureGroup?.getLayers().length ?? 0 > 0

  useEffect(() => {
    if (!L || !featureGroup || !map || !isActive) {
      controlRef.current?.disable?.()
      controlRef.current = null
      return
    }
    const control = createDrawTool(L, map as DrawMap, featureGroup)
    control.enable?.()
    controlRef.current = control
    return () => {
      control.disable?.()
      controlRef.current = null
    }
  }, [L, map, isActive, featureGroup, createDrawTool])

  function handleClick() {
    controlRef.current?.save()
    setActiveMode(isActive ? null : drawAction)
  }

  return (
    <Button
      type="button"
      size="icon-sm"
      aria-label={`${drawAction === 'edit' ? 'Edit' : 'Remove'} shapes`}
      title={`${drawAction === 'edit' ? 'Edit' : 'Remove'} shapes`}
      variant={isActive ? 'default' : 'secondary'}
      disabled={!hasFeatures}
      onClick={handleClick}
      className={cn('border', className)}
      {...props}
    />
  )
}

function MapDrawEdit({
  selectedPathOptions = {
    color: 'var(--color-primary)',
    fillColor: 'var(--color-primary)',
    weight: 2,
  },
  ...props
}: Omit<EditToolbar.EditHandlerOptions, 'featureGroup'>) {
  const { L } = useLeaflet()
  const mapDrawHandleIcon = useMapDrawHandleIcon()
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error('MapDrawEdit must be used within MapDrawControl')
  }

  useEffect(() => {
    if (!L || !mapDrawHandleIcon) return

    L.Edit.PolyVerticesEdit.mergeOptions({
      icon: mapDrawHandleIcon,
      touchIcon: mapDrawHandleIcon,
      drawError: {
        color: 'var(--color-destructive)',
      },
    })
    L.Edit.SimpleShape.mergeOptions({
      moveIcon: mapDrawHandleIcon,
      resizeIcon: mapDrawHandleIcon,
      touchMoveIcon: mapDrawHandleIcon,
      touchResizeIcon: mapDrawHandleIcon,
    })
    L.drawLocal.edit.handlers.edit.tooltip = {
      text: 'Drag handles or markers to edit.',
      subtext: '',
    }
    L.drawLocal.edit.handlers.remove.tooltip = {
      text: 'Click on a shape to remove.',
    }
  }, [mapDrawHandleIcon])

  return (
    <MapDrawActionButton
      drawAction="edit"
      controlRef={drawContext.editControlRef}
      createDrawTool={(L, map, featureGroup) =>
        new L.EditToolbar.Edit(map, {
          featureGroup,
          selectedPathOptions,
          ...props,
        })
      }
    >
      <PenLineIcon />
    </MapDrawActionButton>
  )
}

function MapDrawDelete() {
  const drawContext = useMapDrawContext()
  if (!drawContext) {
    throw new Error('MapDrawDelete must be used within MapDrawControl')
  }

  return (
    <MapDrawActionButton
      drawAction="delete"
      controlRef={drawContext.deleteControlRef}
      createDrawTool={(L, map, featureGroup) =>
        new L.EditToolbar.Delete(map, { featureGroup })
      }
    >
      <Trash2Icon />
    </MapDrawActionButton>
  )
}

function MapDrawUndo({ className, ...props }: React.ComponentProps<'button'>) {
  const drawContext = useMapDrawContext()
  if (!drawContext)
    throw new Error('MapDrawUndo must be used within MapDrawControl')

  const { activeMode, setActiveMode, editControlRef, deleteControlRef } =
    drawContext

  const isInEditMode = activeMode === 'edit'
  const isInDeleteMode = activeMode === 'delete'
  const isActive = isInEditMode || isInDeleteMode

  function handleUndo() {
    if (isInEditMode) {
      editControlRef.current?.revertLayers()
    } else if (isInDeleteMode) {
      deleteControlRef.current?.revertLayers()
    }
    setActiveMode(null)
  }

  return (
    <Button
      type="button"
      size="icon-sm"
      variant="secondary"
      aria-label={`Undo ${activeMode}`}
      title={`Undo ${activeMode}`}
      onClick={handleUndo}
      disabled={!isActive}
      className={cn('border', className)}
      {...props}
    >
      <Undo2Icon />
    </Button>
  )
}

function MapControlContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { L } = useLeaflet()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!L) return
    const element = containerRef.current
    if (!element) return
    L.DomEvent.disableClickPropagation(element)
    L.DomEvent.disableScrollPropagation(element)
  }, [L])

  return (
    <div
      ref={containerRef}
      className={cn('absolute z-1000 size-fit cursor-default', className)}
      {...props}
    />
  )
}

function useMapDrawHandleIcon() {
  const { L } = useLeaflet()
  if (!L) return null

  return L.divIcon({
    iconAnchor: [8, 8],
    html: renderToString(
      <CircleIcon className="fill-primary stroke-primary size-4 transition-transform hover:scale-110" />
    ),
  })
}

function useLeaflet() {
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [LeafletDraw, setLeafletDraw] = useState<
    typeof import('leaflet-draw') | null
  >(null)

  useEffect(() => {
    if (L && LeafletDraw) return
    if (typeof window !== 'undefined') {
      if (!L) {
        import('leaflet').then(module => {
          setL(module)
        })
      }
      if (!LeafletDraw) {
        import('leaflet-draw').then(module => {
          setLeafletDraw(module)
        })
      }
    }
  }, [L, LeafletDraw])

  return { L, LeafletDraw }
}

function useDebounceLoadingState(delay = 200) {
  const [isLoading, setIsLoading] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      setShowLoading(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isLoading, delay])

  return [showLoading, setIsLoading] as const
}

export type MapBounds = {
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
}

type MapBoundsHandlerProps = {
  onBoundsChange: (bounds: MapBounds) => void
}

function MapBoundsHandlerInner({ onBoundsChange }: MapBoundsHandlerProps) {
  const RL = useReactLeaflet()
  const map = RL?.useMap()
  const onBoundsChangeRef = useRef(onBoundsChange)
  const initialBoundsCalledRef = useRef(false)

  // Keep callback ref updated without triggering effect
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange
  }, [onBoundsChange])

  useEffect(() => {
    if (!map) return

    const handleBoundsChange = () => {
      const bounds = map.getBounds()
      onBoundsChangeRef.current({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLon: bounds.getWest(),
        maxLon: bounds.getEast(),
      })
    }

    // Get initial bounds only once
    if (!initialBoundsCalledRef.current) {
      // Small delay to ensure map is fully initialized
      setTimeout(() => {
        if (map.getBounds()) {
          handleBoundsChange()
          initialBoundsCalledRef.current = true
        }
      }, 100)
    }

    map.on('moveend', handleBoundsChange)
    map.on('zoomend', handleBoundsChange)

    return () => {
      map.off('moveend', handleBoundsChange)
      map.off('zoomend', handleBoundsChange)
    }
  }, [map])

  return null
}

function MapBoundsHandler(props: MapBoundsHandlerProps) {
  return <MapBoundsHandlerInner {...props} />
}

export {
  Map,
  MapBoundsHandler,
  MapCircle,
  MapCircleMarker,
  MapControlContainer,
  MapDrawCircle,
  MapDrawControl,
  MapDrawDelete,
  MapDrawEdit,
  MapDrawMarker,
  MapDrawPolygon,
  MapDrawPolyline,
  MapDrawRectangle,
  MapDrawUndo,
  MapFeatureGroup,
  MapLayerGroup,
  MapLayers,
  MapLayersControl,
  MapLocateControl,
  MapMarker,
  MapMarkerClusterGroup,
  MapPolygon,
  MapPolyline,
  MapPopup,
  MapRectangle,
  MapSearchControl,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
  useLeaflet,
}
