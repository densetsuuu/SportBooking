import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuth } from '~/hooks/use-auth'
import { Button } from '~/components/ui/button'
import { UserAvatar } from '~/components/user-avatar'
import { useEasterEgg } from "~/hooks/useEasterEgg";
import CardWithClose from "~/components/easter-egg";

export const Route = createFileRoute('/(app)/')({
  component: App,
})

function App() {
  const { user, signOut } = useAuth()
  const { visible, close } = useEasterEgg();

  return (
    <div className="text-center h-screen flex flex-col justify-center items-center">
      {user ? (
        <div className="flex flex-col items-center gap-4">
          <UserAvatar user={user} />
          <p>Bienvenue, {user.fullName}!</p>
          <Button variant="link" asChild>
            <Link to={'/users/$userId'} params={{ userId: user.id }}>
              Voir le profil
            </Link>
          </Button>
          <Button variant="destructive" onClick={signOut}>
            Se déconnecter
          </Button>
        </div>
      ) : (
        <div>
          <p>Bienvenue sur notre application!</p>
          <Button asChild>
            <Link to={'/login'}>Se connecter</Link>
          </Button>
        </div>
      )}
      {visible && (
        <div className="fixed top-4 right-4 z-[9999]">
          <CardWithClose
            imageSrc="\gagawanoeuf.jpg"
            text="Linkedin"
            text2="Interpol"
            onClose={close}
          />
        </div>
      )}
    </div>
  )
}
