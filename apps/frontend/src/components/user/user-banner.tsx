import { UserAvatar } from '~/components/user-avatar'
import { User } from '~/hooks/use-auth'

type UserBannerProps = {
  user: User
}

export function UserBanner({ user }: UserBannerProps) {
  return (
    <div className="relative">
      <div
        className="rounded-xl h-25 overflow-hidden bg-cover bg-primary/30"
        style={{
          backgroundImage: `url(${user.avatar?.url})`,
        }}
      >
        <div className="backdrop-blur-xl h-full w-full"></div>
      </div>
      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-8/10">
        <UserAvatar
          user={user}
          className="size-16 ring-4 ring-background bg-background [&>[data-slot=avatar-fallback]]:text-lg"
        />
      </div>
    </div>
  )
}
