import { UserAvatar } from '~/components/user-avatar'
import { ImageIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { User } from '~/hooks/use-auth'
import { RefObject } from 'react'

type UserAvatarInputProps = {
  avatarFile: File | undefined
  user: User
  inputRef: RefObject<HTMLInputElement | null>
}

export function UserAvatarInput({
  avatarFile,
  user,
  inputRef,
}: UserAvatarInputProps) {
  return (
    <Button
      className="p-0 group ring-4 ring-background bg-background size-fit rounded-full relative"
      onClick={() => inputRef.current?.click()}
      type="button"
    >
      {avatarFile ? (
        <img
          src={URL.createObjectURL(avatarFile)}
          alt="Avatar preview"
          className="size-16 rounded-full object-cover group-hover:brightness-50 flex shrink-0"
        />
      ) : (
        <UserAvatar
          user={user}
          className="size-16 [&>[data-slot=avatar-fallback]]:text-lg group-hover:brightness-50"
        />
      )}
      <div className="absolute inset-0.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
        <ImageIcon className="size-6 text-stone-300" />
      </div>
    </Button>
  )
}
