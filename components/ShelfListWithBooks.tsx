// components/ShelfListWithBooks.tsx

'use client'

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ShelfList from './ShelfList';
import BookList from './BookList';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import BookSearchFilter from './BookSearchFilter';
import { LibraryBig } from 'lucide-react';

// Types
type Shelf = {
  id: string
  title: string
  slug: string
}

type Book = {
  id: string
  title: string
  image: string
  authors: { name: string }[]
  price?: string
  rating?: number
}

// API Calls
const fetchShelves = async (): Promise<Shelf[]> => {
  const { data } = await axios.get(
    'https://api.glose.com/users/5a8411b53ed02c04187ff02a/shelves'
  )
  return data
}

const fetchBooksFromShelf = async (shelfId: string): Promise<Book[]> => {
  const { data } = await axios.get(`https://api.glose.com/shelves/${shelfId}/forms`)
  console.log('Réponse brute de forms :', data)

  if (!Array.isArray(data)) {
    console.error('Donnée reçue n’est pas un tableau !', data)
    throw new Error('La réponse attendue est un tableau d’IDs de livres.')
  }

  const books = await Promise.all(
    data.map(async (formId: string, index: number) => {
      try {
        const { data: book } = await axios.get(`https://api.glose.com/forms/${formId}`)
        console.log(`Livre ${index + 1} récupéré :`, book)
        return book
      } catch (err) {
        console.error(`Erreur lors du chargement du livre formId ${formId}`, err)
        return null
      }
    })
  )

  const validBooks = books.filter((book): book is Book => book !== null)
  console.log('Livres valides récupérés :', validBooks.length)
  return validBooks
}

// Main Component
export default function ShelfListWithBooks() {
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  const { data: shelves, isLoading: loadingShelves } = useQuery({
    queryKey: ['shelves'],
    queryFn: fetchShelves,
  })

  // Sélection automatique de la première étagère
  useEffect(() => {
    if (shelves && shelves.length > 0 && !selectedShelfId) {
      setSelectedShelfId(shelves[0].id)
    }
  }, [shelves, selectedShelfId])

  const {
    data: books,
    isLoading: loadingBooks,
    isFetching,
  } = useQuery<Book[], Error, Book[], [string, string | null]>({
    queryKey: ['shelf-books', selectedShelfId],
    queryFn: () => fetchBooksFromShelf(selectedShelfId!),
    enabled: !!selectedShelfId,
    onSuccess: (data) => {
      setFilteredBooks(data)
    },
  })
  
  return (
    <div className="flex w-full h-full p-2 gap-1 fixed">
      <Card className="w-50 max-w-xs p-2 -mb-5 border-none">
      
        <h2 className="text-xl font-bold -mt-3 flex flex-row gap-2"><LibraryBig  color="indigo"/> Bibliothèques</h2>
        <Separator className="mb-4" />
        {loadingShelves ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <ShelfList
            shelves={shelves || []}
            selectedShelfId={selectedShelfId}
            onSelect={(id) => {
              console.log('Mise à jour shelf sélectionnée:', id)
              setSelectedShelfId(id)
            }}
          />
        )}
      </Card>

      <div className="flex-1">
        <Card className="w-full p-2 border-none pb-5">
          <ScrollArea className="h-[95vh] pr-2">
            <BookSearchFilter books={books} onFilter={setFilteredBooks} /> 
            <BookList books={filteredBooks} loading={loadingBooks || isFetching} />
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
