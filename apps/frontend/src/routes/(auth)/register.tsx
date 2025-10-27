import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '~/components/auth/register-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export const Route = createFileRoute('/(auth)/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card className="flex flex-col items-center gap-6 w-100">
      <CardHeader className="w-full text-center">
        <CardTitle>Créez un compte</CardTitle>
        <CardDescription>
          Nous avons juste besoin de quelques détails.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full gap-3 flex flex-col">
        <RegisterForm />
      </CardContent>
    </Card>
  )
}
