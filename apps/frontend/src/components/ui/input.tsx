import * as React from 'react'

import { cn } from '~/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground/60 selection:bg-secondary/20 selection:text-foreground dark:bg-input/30 border-input h-11 w-full min-w-0 rounded-xl border bg-background px-4 py-2 text-base shadow-sm transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'hover:border-secondary/30',
        'focus-visible:border-secondary focus-visible:ring-secondary/20 focus-visible:ring-4',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Input }
