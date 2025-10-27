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

export function RegisterForm() {
  const form = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
  })

  const onSubmit = (data: z.infer<typeof createAccountFormSchema>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form className="grid w-full max-w-sm items-center gap-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" className="w-full">
          Sign up
        </Button>
      </form>

      <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
        <span className="text-muted-foreground text-xs">Or</span>
      </div>

      <Button variant="outline" className="w-full">
        <Icons.google className="size-4" />
        S&#39;inscrire avec Google
      </Button>

      <p className="text-muted-foreground text-center text-xs">
        By signing up you agree to our{' '}
        <a className="underline hover:no-underline" href="#">
          Terms
        </a>
        .
      </p>
    </Form>
  )
}
