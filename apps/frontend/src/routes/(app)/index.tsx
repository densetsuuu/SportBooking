import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
// @ts-ignore
import { useQuery } from '@tanstack/react-query'
import CardWithClose from '~/components/easter-egg'
import { ListView } from '~/components/list-view'
import { useEasterEgg } from '~/hooks/useEasterEgg'
import { getSportEquipmentQueryOptions } from '~/lib/queries/sport-equipments'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { MapView } from '~/components/map-view'

export const Route = createFileRoute('/(app)/')({
  component: App,
})

function App() {
  const [page, setPage] = useState(1)
  const { visible, close } = useEasterEgg()

  const { data } = useQuery(
    getSportEquipmentQueryOptions({
      payload: {
        page,
        limit: 5,
      },
    })
  )

  console.log(data?.data)

  const handleNextPage = () => {
    if (data && page < data.total) {
      setPage(page + 1)
    }
  }
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  return (
    <div className="bg-[#282c34]">
      <Tabs defaultValue="list" className="flex items-center">
        <TabsList className="mt-5 w-3/4">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="map">Carte</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="text-center">
            <header className="min-h-screen flex flex-col items-center justify-center text-white text-[calc(10px+2vmin)] mt-6">
              {data?.data && (
                <>
                  <ListView results={data?.data ?? []} />
                  {/* PAGINATION */}
                  <div className="flex gap-4 mt-6 items-center justify-center">
                    <button
                      onClick={handlePreviousPage}
                      disabled={page === 1}
                      className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
                    >
                      ◀ Précédent
                    </button>
                    <span>
                      Page {page} / {(data && data.total) || 1}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={data && page === data.total}
                      className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
                    >
                      Suivant ▶
                    </button>
                  </div>
                </>
              )}
            </header>
          </div>
        </TabsContent>
        <TabsContent value="map" className="w-full h-screen flex items-center justify-center">
          <MapView results={data?.data ?? []} />
        </TabsContent>
      </Tabs>
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
