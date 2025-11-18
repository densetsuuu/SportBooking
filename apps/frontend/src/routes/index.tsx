import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
// @ts-ignore
import { ListView } from '~/components/list-view'
import {useQuery} from "@tanstack/react-query";
import {getSportEquipmentQueryOptions} from "~/lib/queries/sport-equipments";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [page, setPage]= useState(1);

  const { data } = useQuery(
    getSportEquipmentQueryOptions({
      payload: {
        page,
        limit: 5
      }
    }));

  console.log(data?.data);

  const handleNextPage = () => {
    if (data && page < data.total) {
      setPage(page + 1);
    }
  }
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        {data?.data && (
          <>
            <ListView results={(data?.data ?? [])} />
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
                Page {page} / {data && data.total || 1}
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
  )
}
