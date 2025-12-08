import React from "react"
import { SportPlaceItem } from "./sport-place-item"
import { SportEquipment } from "~/lib/queries/sport-equipments";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function MapView({ results }: { results: SportEquipment[] }) {
  
  return (
    <div className="h-screen w-3/4 rounded-b-xl overflow-hidden mb-5 mt-5">
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        <Marker position={[48.8566, 2.3522]}>
          <Popup>
            <div className="p-3 rounded-xl shadow-lg bg-white text-gray-800 max-w-[200px] min-w-[150px]">
              <h3 className="font-semibold text-lg mb-1">Paris ✨</h3>
              <p className="text-sm text-gray-600">
                Capitale de la France, ville lumière.
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}