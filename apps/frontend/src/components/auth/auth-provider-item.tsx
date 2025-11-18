import { Icons } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { SocialAccount } from '~/lib/queries/user'
import { useMutation } from '@tanstack/react-query'
import { disconnectSocialProviderMutationOptions } from '~/lib/queries/auth'

type AuthProviderItemProps = {
  account: SocialAccount
}

export function AuthProviderItem({ account }: AuthProviderItemProps) {
  const ProviderIcon =
    Icons[account.provider.toLowerCase() as keyof typeof Icons]

  const useUnlinkProvider = useMutation(disconnectSocialProviderMutationOptions)

  const handleUnlink = () => {
    void useUnlinkProvider.mutateAsync({
      params: {
        provider: account.provider,
      },
    })
  }

  return (
    <Card className="p-3">
      <CardContent className="inline-flex text-sm justify-between items-center px-1">
        <div className="inline-flex gap-2 items-center">
          <div className="border rounded-lg p-1.5">
            {ProviderIcon ? <ProviderIcon className="h-4 w-4" /> : null}
          </div>
          <p>@{account.username}</p>
        </div>
        <Button
          variant="outline"
          className="rounded-lg"
          size="sm"
          loading={useUnlinkProvider.isPending}
          onClick={handleUnlink}
        >
          Déconnecter
        </Button>
      </CardContent>
    </Card>
  )
}
