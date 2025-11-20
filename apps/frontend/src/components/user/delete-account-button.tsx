import { Trash2Icon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { usersQueries } from '~/lib/queries/user'
import { useAuth } from '~/hooks/use-auth'
import { ProtectedContent } from '~/components/protected-content'

type DeleteAccountButtonProps = {
  user: {
    id: string
  }
}

export function DeleteAccountButton({ user }: DeleteAccountButtonProps) {
  const { user: currentUser } = useAuth()
  const useDeleteAccount = useMutation(usersQueries.delete(user.id))

  return (
    <ProtectedContent predicate={currentUser?.id === user.id}>
      <Button
        variant="link"
        className="text-destructive hover:no-underline hover:brightness-75"
        onClick={() => void useDeleteAccount.mutateAsync({})}
      >
        <Trash2Icon className="size-4" />
        Supprimer le compte
      </Button>
    </ProtectedContent>
  )
}
