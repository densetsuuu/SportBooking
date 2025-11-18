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
import { Link } from '@tanstack/react-router'
import { PasswordField } from '~/components/ui/password-field'
import { PasswordStrength } from '~/components/ui/password-strength'
import { useMutation } from '@tanstack/react-query'
import { registerMutationOptions } from '~/lib/queries/auth'

export function RegisterForm() {
  const useRegister = useMutation(registerMutationOptions)

  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: z.infer<typeof createAccountFormSchema>) => {
    void useRegister.mutateAsync({
      payload: data,
    })
  }

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
                <PasswordStrength password={field.value} />
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

          <Button
            type="submit"
            className="w-full mt-2"
            loading={useRegister.isPending}
          >
            Créer mon compte
          </Button>
        </form>
      </Form>

      <div className="inline-flex gap-1 justify-center text-sm w-full">
        <p className="text-muted-foreground">Vous avez déjà un compte ? </p>
        <Link
          to="/login"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Se connecter
        </Link>
      </div>
    </div>
  )
}
