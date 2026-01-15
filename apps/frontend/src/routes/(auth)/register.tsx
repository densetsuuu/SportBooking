import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '~/components/auth/register-form'
import { Trophy, MapPin, Zap, Users, Target } from 'lucide-react'
import DottedGlowBackground from '~/components/ui/dotted-glow-background'
import { PointerHighlight } from '~/components/ui/pointer-highlight'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const features = [
    { icon: Target, label: 'Réservation instantanée' },
    { icon: Users, label: 'Communauté active' },
    { icon: Zap, label: 'Notifications temps réel' },
  ]

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full flex-col justify-center overflow-y-auto px-6 py-12 lg:w-1/2 lg:px-16"
      >
        <div className="mx-auto w-full max-w-md">
          {/* Logo link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span
                className="font-bold text-lg group-hover:text-secondary transition-colors"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                SportBooking
              </span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight mb-3"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Rejoignez-nous
            </h1>
            <p className="text-muted-foreground text-lg">
              Créez votre compte en quelques minutes et commencez votre aventure
              sportive.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <RegisterForm />
          </motion.div>
        </div>
      </motion.div>

      {/* Visual Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center m-4 rounded-2xl overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-primary" />

        {/* Animated dots background */}
        <DottedGlowBackground
          className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-25"
          opacity={1}
          gap={12}
          radius={1.8}
          colorLightVar="--color-neutral-100"
          glowColorLightVar="--color-neutral-200"
          colorDarkVar="--color-neutral-100"
          glowColorDarkVar="--color-emerald-300"
          backgroundOpacity={0}
          speedMin={0.2}
          speedMax={1.2}
          speedScale={0.8}
        />

        {/* Content */}
        <div className="relative z-10 text-right text-white p-12 lg:p-16 flex flex-col items-end max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Trophy className="w-8 h-8" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4 text-3xl lg:text-4xl font-bold leading-tight"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Votre aventure sportive{' '}
            <PointerHighlight
              containerClassName="inline-block"
              rectangleClassName="rounded-lg"
            >
              <span className="px-2">commence ici</span>
            </PointerHighlight>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/80 text-lg mb-10"
          >
            Réservez vos terrains, organisez vos matchs et connectez-vous avec
            d&apos;autres passionnés de sport.
          </motion.p>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center justify-end gap-3 text-white/70"
              >
                <span className="text-sm">{feature.label}</span>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <feature.icon className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-sport-energy/20 rounded-full blur-3xl" />
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </motion.div>
    </div>
  )
}
