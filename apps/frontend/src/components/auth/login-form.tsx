import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { loginFormSchema } from '~/lib/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Icons } from '~/components/icons'
import { Link } from '@tanstack/react-router'
import { PasswordField } from '~/components/ui/password-field'
import { useMutation } from '@tanstack/react-query'
import { loginMutationOptions } from '~/lib/queries/auth'
import { motion } from 'motion/react'

export function LoginForm() {
  const useLogin = useMutation(loginMutationOptions())

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    void useLogin.mutateAsync({
      payload: data,
    })
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="text-sm font-medium"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Adresse email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className="text-sm font-medium"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <PasswordField {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end w-full">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-secondary transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            loading={useLogin.isPending}
          >
            <span style={{ fontFamily: 'Outfit, sans-serif' }}>
              Se connecter
            </span>
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button variant="outline" className="w-full h-12 gap-3" asChild>
          <a
            href={`${import.meta.env.VITE_API_URL}/auth/social/google/redirect`}
          >
            <Icons.google className="h-5 w-5" />
            <span style={{ fontFamily: 'Outfit, sans-serif' }}>Google</span>
          </a>
        </Button>
      </motion.div>

      <div className="space-y-3 text-center pt-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          En vous connectant, vous acceptez nos{' '}
          <a
            href="#"
            className="text-secondary hover:underline underline-offset-2"
          >
            Conditions d&apos;utilisation
          </a>{' '}
          et notre{' '}
          <a
            href="#"
            className="text-secondary hover:underline underline-offset-2"
          >
            Politique de confidentialité
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas de compte ?{' '}
          <Link
            to="/register"
            className="font-semibold text-secondary hover:underline underline-offset-2"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
