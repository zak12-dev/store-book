'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Shelf = {
  id: string
  title: string
  slug: string
}

type ShelfListProps = {
  shelves: Shelf[]
  selectedShelfId: string | null
  onSelect: (id: string) => void
}

export default function ShelfList({
  shelves,
  selectedShelfId,
  onSelect,
}: ShelfListProps) {
  return (
    <Card className="w-full max-w-xs h-full border-none shadow-none -mt-13 bg-gray-100">
      <CardContent className="p-0">
        <Separator className="mb-0" />

        <ul className="space-y-1">
          {shelves.map((shelf, index) => {
            const isSelected = selectedShelfId === shelf.id

            return (
              <div key={shelf.id}>
                <li
                  onClick={() => {
                    console.log('Étagère sélectionnée:', shelf.id)
                    onSelect(shelf.id)
                  }}
                  className={`cursor-pointer p-1 rounded-lg text-sm font-medium border transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800 border-blue-400 shadow'
                        : 'hover:bg-muted hover:text-foreground border-transparent'
                    }`}
                >
                  {shelf.title}
                </li>
                {index !== shelves.length - 1 && <Separator className="my-1 bg-gray-300" />}
              </div>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
