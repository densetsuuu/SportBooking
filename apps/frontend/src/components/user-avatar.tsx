import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { ComponentProps } from 'react'

type UserAvatarProps = {
  user: {
    fullName: string
    avatar: { url?: string } | null
  }
} & ComponentProps<typeof Avatar>

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  const initials = `${user.fullName.split(' ')[0]?.[0] ?? ''}${
    user.fullName.split(' ').slice(-1)[0]?.[0] ?? ''
  }`.toUpperCase()

  return (
    <Avatar className="rounded-full" {...props}>
      <AvatarFallback className="border-0">{initials}</AvatarFallback>
      <AvatarImage className="border-0" alt={initials} src={user.avatar?.url} />
    </Avatar>
  )
}
