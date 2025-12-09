import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CardWithClose from '~/components/easter-egg'
import { ListView } from '~/components/list-view'
import { useEasterEgg } from '~/hooks/useEasterEgg'
import { getSportEquipmentQueryOptions } from '~/lib/queries/sport-equipments'
import "leaflet/dist/leaflet.css";

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
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        {data?.data && (
          <>
            <ListView results={data?.data ?? []} />
            {/* PAGINATION */}
            <div className="flex gap-4 mt-6 items-center justify-center mb-3">
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
