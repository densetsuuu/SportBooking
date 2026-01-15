import { List, MapIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '~/lib/utils'

type ViewToggleProps = {
  view: 'list' | 'map'
  onChange: (view: 'list' | 'map') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="relative inline-flex items-center p-1 bg-muted rounded-full border border-border/50">
      {/* Animated background pill */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 35,
        }}
        className="absolute top-1 bottom-1 w-[calc(50%-2px)] bg-background rounded-full shadow-sm border border-border/30"
        style={{
          left: view === 'list' ? '4px' : 'calc(50% + 2px)',
        }}
      />

      <button
        onClick={() => onChange('list')}
        className={cn(
          'relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
          view === 'list'
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">Liste</span>
      </button>

      <button
        onClick={() => onChange('map')}
        className={cn(
          'relative z-10 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
          view === 'map'
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        style={{ fontFamily: 'Outfit, sans-serif' }}
      >
        <MapIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Carte</span>
      </button>
    </div>
  )
}
