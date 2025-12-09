import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CardWithClose from '~/components/easter-egg'
import { ListView } from '~/components/list-view'
import { useEasterEgg } from '~/hooks/useEasterEgg'
import { getSportEquipmentQueryOptions } from '~/lib/queries/sport-equipments'
import { searchSchema } from '~/lib/schemas/common'
import 'leaflet/dist/leaflet.css'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'

export const Route = createFileRoute('/(app)/')({
  validateSearch: searchSchema,
  component: App,
})

function App() {
  const [page, setPage] = useState(1)
  const { visible, close } = useEasterEgg()
  const { name, city, sport } = Route.useSearch()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [name, city, sport])

  const { data } = useQuery(
    getSportEquipmentQueryOptions({
      payload: {
        page,
        limit: 5,
        nom: name || undefined,
        typeSport: sport || undefined,
        ville: city || undefined,
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
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        {data?.data && (
          <>
            <ListView results={data?.data ?? []} />
            <Pagination className={'pb-3'}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    disabled={page === 1}
                    onClick={handlePreviousPage}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    disabled={page === 1}
                    onClick={handlePreviousPage}
                  >
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive className={'text-primary'}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    disabled={data && page === Math.ceil(data.total / 5)}
                    onClick={handleNextPage}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    disabled={data && page === Math.ceil(data.total / 5)}
                    onClick={handleNextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
