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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="exemple@email.com"
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
                <FormLabel>Mot de passe</FormLabel>
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
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" className="w-full" loading={useLogin.isPending}>
            Se connecter
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>

      <div className="space-y-2 text-center">
        <p className="text-xs text-muted-foreground">
          En vous connectant, vous acceptez nos{' '}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Conditions d&apos;utilisation
          </a>{' '}
          et notre{' '}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Politique de confidentialité
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas de compte ?{' '}
          <Link
            to="/register"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}
