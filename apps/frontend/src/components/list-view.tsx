import React from 'react'
import { SportPlaceItem } from './sport-place-item'
import { SportEquipment } from '~/lib/queries/sport-equipments'

export function ListView({ results }: { results: SportEquipment[] }) {
  return (
    <div className="grid gap-6">
      {results.map((equipment, index) => (
        <SportPlaceItem key={index} equipment={equipment} />
      ))}
    </div>
  )
}
