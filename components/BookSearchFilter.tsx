'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'


type Book = {
  id: string
  title: string
  image: string
  authors: { name: string }[]
  price?: string 
  rating?: number
}

type BookSearchFilterProps = {
  books: Book[] | undefined
  onFilter: (filtered: Book[]) => void
}

export default function BookSearchFilter({ books, onFilter }: BookSearchFilterProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!books) return

    const lowerQuery = query.toLowerCase().trim()

    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.authors?.some(author =>
        author.name.toLowerCase().includes(lowerQuery)
      )
    )

    onFilter(filtered)
  }, [query, books, onFilter])

  return (
    <Card className="mb-2 p-0 shadow-md bg-gray-100 border-none ">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          Rechercher un livre
        </CardTitle>
      </CardHeader>
      <CardContent className='-mt-7'>
        <Input
          type="text"
          placeholder=" Entrez votre livre préféré..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full transition-all duration-200 ease-in-out border border-gray-300 focus:outline-none focus:border-gray-400 focus:ring-0 focus:ring-gray-200"
        />
      </CardContent>
    </Card>
  )
}
