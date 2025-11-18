import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { ComponentProps } from 'react'

type UserAvatarProps = {
  user: {
    fullName: string
  }
} & ComponentProps<typeof Avatar>

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  const initials = `${user.fullName.split(' ')[0]?.[0] ?? ''}${
    user.fullName.split(' ').slice(-1)[0]?.[0] ?? ''
  }`.toUpperCase()

  return (
    <Avatar {...props}>
      <AvatarFallback className="rounded-lg text-xs">{initials}</AvatarFallback>
      <AvatarImage alt={initials} />
    </Avatar>
  )
}
