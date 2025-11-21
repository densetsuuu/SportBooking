import { Trash2Icon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { usersQueries } from '~/lib/queries/user'
import { useAuth } from '~/hooks/use-auth'
import { ProtectedContent } from '~/components/protected-content'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { useState } from 'react'

type DeleteAccountButtonProps = {
  user: {
    id: string
    email: string
  }
}

export function DeleteAccountButton({ user }: DeleteAccountButtonProps) {
  const { user: currentUser } = useAuth()
  const useDeleteAccount = useMutation(usersQueries.delete(user.id))
  const [confirmationText, setConfirmationText] = useState('')

  return (
    <ProtectedContent predicate={currentUser?.id === user.id}>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button
            variant="link"
            className="text-destructive hover:no-underline hover:brightness-75"
          >
            <Trash2Icon className="size-4" />
            Supprimer le compte
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Supprimer le compte ?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="font-medium text-foreground">
                  Cette action est irréversible. Cela supprimera définitivement
                  votre compte et supprimera toutes vos données de nos serveurs.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    Veuillez taper{' '}
                    <strong className="font-mono text-foreground">
                      {user.email}
                    </strong>{' '}
                    pour confirmer:
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-delete" className="sr-only">
                      Confirmer l&#39;email
                    </Label>
                    <Input
                      id="confirm-delete"
                      value={confirmationText}
                      onChange={e => setConfirmationText(e.target.value)}
                      placeholder="Tapez votre email pour confirmer"
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmationText('')}>
              Annuler
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => void useDeleteAccount.mutateAsync({})}
              disabled={confirmationText !== user.email}
            >
              Je comprends, supprimer mon compte
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedContent>
  )
}
