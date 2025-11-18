import { UserAvatar } from '~/components/user-avatar'
import { User } from '~/hooks/use-auth'

type UserBannerProps = {
  user: User
}

export function UserBanner({ user }: UserBannerProps) {
  return (
    <div className="relative">
      <div className="bg-primary rounded-xl h-25"></div>
      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-8/10">
        <UserAvatar
          user={user}
          className="size-16 ring-4 ring-background bg-background [&>[data-slot=avatar-fallback]]:text-lg"
        />
      </div>
    </div>
  )
}
