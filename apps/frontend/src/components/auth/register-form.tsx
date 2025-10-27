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
import { createAccountFormSchema } from '~/lib/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Icons } from '~/components/icons'
import { Link } from '@tanstack/react-router'
import { PasswordField } from '~/components/ui/password-field'

export function RegisterForm() {
  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof createAccountFormSchema>) => {}

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <PasswordField {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Créer mon compte
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
        <p className="text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
