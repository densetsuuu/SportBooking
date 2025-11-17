import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '~/components/auth/login-form'
import { UserCheck } from 'lucide-react'
import DottedGlowBackground from '~/components/ui/dotted-glow-background'
import { PointerHighlight } from '~/components/ui/pointer-highlight'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Form Section */}
      <div className="flex w-full flex-col justify-center overflow-y-auto px-8 py-8 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="mt-2 text-muted-foreground">
              Connectez-vous à votre compte pour accéder à vos réservations et
              continuer votre aventure sportive.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>

      {/* Image Section */}
      <div className="relative hidden bg-primary lg:flex lg:w-1/2 lg:items-center lg:justify-center m-4 rounded-lg">
        <DottedGlowBackground
          className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
          opacity={1}
          gap={10}
          radius={1.6}
          colorLightVar="--color-neutral-500"
          glowColorLightVar="--color-neutral-600"
          colorDarkVar="--color-neutral-500"
          glowColorDarkVar="--color-sky-800"
          backgroundOpacity={0}
          speedMin={0.3}
          speedMax={1.6}
          speedScale={1}
        />
        <div className="text-right text-white p-20 flex flex-col items-end">
          <div className="mb-8">
            <UserCheck className="size-14" />
          </div>
          <h2 className="mb-4 text-4xl font-bold">
            Prêt à reprendre{' '}
            <PointerHighlight containerClassName="inline-block">
              <span>l&apos;action</span>
            </PointerHighlight>
          </h2>
          <p className="text-md opacity-90">
            Retrouvez vos terrains favoris, vos équipes et tous vos matchs en
            cours.
          </p>
        </div>
      </div>
    </div>
  )
}
