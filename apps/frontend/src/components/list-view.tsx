import { SportPlaceItem } from './sport-place-item'
import { SportEquipment } from '~/lib/queries/sport-equipments'
import { motion } from 'motion/react'

export function ListView({ results }: { results: SportEquipment[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6 w-full max-w-4xl mx-auto"
    >
      {results.map((equipment, index) => (
        <SportPlaceItem
          key={equipment.id || index}
          equipment={equipment}
          index={index}
        />
      ))}

      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
            <svg
              className="w-10 h-10 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3
            className="text-xl font-semibold text-foreground mb-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Aucun résultat trouvé
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Essayez de modifier vos critères de recherche pour trouver plus
            d&apos;équipements sportifs.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
