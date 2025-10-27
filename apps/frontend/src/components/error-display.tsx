import { Button } from '@tatoo/design-system/components/ui/button'
import { TriangleAlertIcon } from 'lucide-react'

interface ErrorDisplayProps {
  error: {
    status: number
    value: {
      message: string
    }
  }
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="p-4 rounded-full bg-red-100">
          <TriangleAlertIcon className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold">Erreur de chargement</h3>
        <p className="text-muted-foreground">{error.value.message}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
        >
          Réessayer
        </Button>
      </div>
    </div>
  )
}
