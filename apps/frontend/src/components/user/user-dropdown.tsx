import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { UserAvatar } from '~/components/user-avatar'
import { useAuth } from '~/hooks/use-auth'
import { Link } from '@tanstack/react-router'

type User = {
  fullName: string
  email: string
  avatarUrl?: string
  id: string
}

export function UserDropdown({ user }: { user: User }) {
  const { signOut } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full">
        <UserAvatar
          user={user}
          className="[&>[data-slot=avatar-fallback]]:text-sm"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <UserAvatar user={user} />
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">
                {user.fullName}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/users/$userId" params={{ userId: user.id }}>
              <UserIcon />
              Profil
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => signOut()}
        >
          <LogOutIcon className="h-4 w-4" /> Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
