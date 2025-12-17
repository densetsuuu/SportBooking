import { createFileRoute, Outlet } from '@tanstack/react-router'
import Header from '~/components/Header'
import CardWithClose from '~/components/easter-egg'
import { useEasterEgg } from '~/hooks/useEasterEgg'

export const Route = createFileRoute('/(app)')({
  component: RouteComponent,
})

function RouteComponent() {
  const { visible, close } = useEasterEgg()

  return (
    <>
      <Header />
      <Outlet />
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
    </>
  )
}
