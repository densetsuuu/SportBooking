import React from "react"
import { SportPlaceItem } from "./sport-place-item"
import { SportEquipment } from "~/lib/queries/sport-equipments";
import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from "~/components/ui/map"

export function MapView({ results }: { results: SportEquipment[] }) {
    return (
        <Map center={[43.6532, -79.3832]}>
            <MapTileLayer />
            <MapZoomControl />
            <MapMarker position={[43.6532, -79.3832]}>
                <MapPopup>A map component for shadcn/ui.</MapPopup>
            </MapMarker>
        </Map>
    )
}