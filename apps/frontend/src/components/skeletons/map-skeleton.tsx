import { Skeleton } from '~/components/ui/skeleton'
import { motion } from 'motion/react'
import { MapIcon } from 'lucide-react'

export function MapSkeleton() {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-muted rounded-xl overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.6 0 0 / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.6 0 0 / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Centered loading indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center"
          >
            <MapIcon className="w-8 h-8 text-secondary" />
          </motion.div>
          <div className="text-sm text-muted-foreground font-medium">
            Chargement de la carte...
          </div>
        </div>
      </motion.div>

      {/* Fake zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
        <Skeleton className="w-8 h-8 rounded-md" />
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>

      {/* Fake scale bar */}
      <div className="absolute bottom-4 left-4 z-10">
        <Skeleton className="w-24 h-4 rounded" />
      </div>

      {/* Fake attribution */}
      <div className="absolute bottom-4 right-4 z-10">
        <Skeleton className="w-32 h-3 rounded" />
      </div>

      {/* Floating marker placeholders */}
      {[
        { top: '30%', left: '40%' },
        { top: '45%', left: '55%' },
        { top: '60%', left: '35%' },
        { top: '25%', left: '65%' },
        { top: '50%', left: '25%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
          className="absolute"
          style={{ top: pos.top, left: pos.left }}
        >
          <Skeleton className="w-6 h-6 rounded-full" />
        </motion.div>
      ))}
    </div>
  )
}
