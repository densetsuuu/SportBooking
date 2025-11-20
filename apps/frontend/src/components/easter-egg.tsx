import React from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { X } from 'lucide-react'

interface CardWithCloseProps {
  imageSrc: string
  imageAlt?: string
  text?: string
  text2?: string
  onClose?: () => void
  className?: string
}

export default function CardWithClose({
  imageSrc,
  imageAlt = 'image',
  text = '',
  text2 = '',
  onClose,
  className = '',
}: CardWithCloseProps) {
  const [result, setResult] = React.useState<string | null>(null)

  function handleClick() {
    const outcomes = ['Bravo !', 'Raté...']
    const random = outcomes[Math.floor(Math.random() * outcomes.length)]
    setResult(random)
  }

  return (
    <Card
      className={`relative w-72 rounded-2xl shadow-lg bg-white overflow-hidden ${className}`}
    >
      <CardContent className="p-0">
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur border border-gray-200 hover:bg-white"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="w-full bg-gray-100 flex items-center justify-center overflow-hidden p-3">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="object-cover w-full h-full"
            draggable={false}
          />
        </div>

        <div className="p-4 flex items-center justify-center gap-4">
          <Button
            onClick={handleClick}
            variant="outline"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {text}
          </Button>
          <p className="text-lg text-gray-700 font-semibold">ou</p>
          <Button
            onClick={handleClick}
            variant="outline"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {text2}
          </Button>
        </div>

        {result && (
          <div className="w-full text-center pb-4 text-xl font-bold">
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
