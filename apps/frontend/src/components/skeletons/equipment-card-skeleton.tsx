import { motion } from 'motion/react'

type EquipmentCardSkeletonProps = {
  index?: number
}

// Custom shimmer skeleton with gradient animation
function ShimmerBox({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-muted/60 ${className}`}>
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background:
            'linear-gradient(90deg, transparent, oklch(0.9 0 0 / 0.4), transparent)',
        }}
      />
    </div>
  )
}

export function EquipmentCardSkeleton({
  index = 0,
}: EquipmentCardSkeletonProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative"
    >
      {/* Main Card Container */}
      <div className="relative bg-card rounded-2xl overflow-hidden border border-border/30 shadow-sm">
        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-12 gap-0">
          {/* Left Column - Typography & Content */}
          <div className="col-span-12 lg:col-span-7 p-6 lg:p-8 flex flex-col min-h-[280px]">
            {/* Top Row - Type Badge */}
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-2">
                <ShimmerBox className="h-3.5 w-24 rounded-full" />
                <div className="flex items-center gap-1">
                  <motion.div
                    animate={{ width: ['0%', '100%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      delay: index * 0.1 + 0.3,
                      ease: 'easeOut',
                    }}
                    className="h-0.5 bg-gradient-to-r from-secondary/40 to-secondary/10 rounded-full"
                    style={{ maxWidth: '32px' }}
                  />
                </div>
              </div>

              {/* Issue Number */}
              <ShimmerBox className="h-3.5 w-12 rounded-md" />
            </div>

            {/* Main Title */}
            <div className="space-y-3 mb-6">
              <ShimmerBox className="h-9 w-full max-w-[300px] rounded-lg" />
              <ShimmerBox className="h-9 w-3/5 rounded-lg" />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2.5 mb-auto">
              <ShimmerBox className="w-4 h-4 rounded-full flex-shrink-0" />
              <ShimmerBox className="h-4 w-52 rounded-md" />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 pt-6 mt-auto border-t border-border/40">
              <ShimmerBox className="h-10 w-28 rounded-full" />
              <ShimmerBox className="h-10 w-36 rounded-full" />
            </div>
          </div>

          {/* Right Column - Map Area */}
          <div className="col-span-12 lg:col-span-5 relative">
            {/* Separator Line */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent" />

            {/* Map Container */}
            <div className="relative h-48 lg:h-full lg:min-h-[280px] overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-secondary/5 to-transparent z-10 hidden lg:block" />

              {/* Map Skeleton with grid pattern */}
              <div className="w-full h-full bg-muted/40 relative">
                {/* Grid pattern overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, oklch(0.7 0 0 / 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, oklch(0.7 0 0 / 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Shimmer overlay */}
                <div
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, oklch(0.95 0 0 / 0.3), transparent)',
                  }}
                />

                {/* Fake marker cluster */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.1 + 0.4,
                    duration: 0.4,
                    type: 'spring',
                    stiffness: 300,
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-secondary/30" />
                  </div>
                </motion.div>

                {/* Fake zoom controls */}
                <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                  <ShimmerBox className="w-7 h-7 rounded-md" />
                  <ShimmerBox className="w-7 h-7 rounded-md" />
                </div>
              </div>

              {/* Floating Index Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: index * 0.1 + 0.5,
                  duration: 0.4,
                  type: 'spring',
                  stiffness: 400,
                }}
                className="absolute bottom-4 right-4 z-20"
              >
                <div className="w-12 h-12 rounded-full bg-card border border-border/50 shadow-lg flex items-center justify-center">
                  <span
                    className="text-lg font-bold text-muted-foreground/50"
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
    </motion.article>
  )
}

export function EquipmentCardSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Add keyframes for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      {Array.from({ length: count }).map((_, index) => (
        <EquipmentCardSkeleton key={index} index={index} />
      ))}
    </div>
  )
}
