import React from "react"
import { SportPlaceItem } from "./sport-place-item"
import { SportEquipment } from "~/lib/queries/sport-equipments";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export function MapView({ results }: { results: SportEquipment[] }) {
    return (
        <div className="h-screen w-1/2 rounded-b-xl overflow-hidden">
          <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[48.8566, 2.3522]}>
              <Popup>Paris ✨</Popup>
            </Marker>
          </MapContainer>
        </div>
    )
}