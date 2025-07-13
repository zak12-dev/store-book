'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Book = {
  id: string
  title: string
  image: string
  authors: { name: string }[]
  price?: string | {
    amount: number
    currency: string
    includes_taxes?: boolean
  }
  rating?: number
}

type BookListProps = {
  books: Book[] | undefined
  loading: boolean
}

const BOOKS_PER_PAGE = 8

export default function BookList({ books, loading }: BookListProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = books ? Math.ceil(books.length / BOOKS_PER_PAGE) : 1

  const paginatedBooks = books?.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  )

  return (
    <div className="w-full md:w-3/3 p-4 overflow-hidden">
      <h2 className="text-xl font-bold mb-4 flex flex-row gap-2">
        <BookOpen color="indigo" />Livres disponibles
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: BOOKS_PER_PAGE }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3 overflow-hidden border-gray-100">
              <Skeleton className="h-48 w-full rounded" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))}
        </div>
      ) : !books ? (
        <p className="text-muted-foreground">Sélectionnez une étagère.</p>
      ) : books.length === 0 ? (
        <p className="text-muted-foreground">Aucun livre trouvé dans cette étagère.</p>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-2"
            >
              {paginatedBooks?.map((book) => (
                <Card
                  key={book.id}
                  className="hover:shadow-lg transition overflow-hidden bg-gray-100 border-gray-100"
                >
                  <CardHeader className="p-0">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-t"
                    />
                  </CardHeader>
                  <CardContent className="space-y-2 pt-3">
                    <CardTitle className="text-md line-clamp-2">
                      {book.title}
                    </CardTitle>
                    {book.authors?.length > 0 && (
                      <p className="text-sm text-muted-foreground truncate">
                        {book.authors.map((author) => author.name).join(', ')}
                      </p>
                    )}
                    {book.price && typeof book.price === 'object' && 'amount' in book.price ? (
                      <Badge className="bg-green-100 text-green-700 w-fit">
                        {book.price.amount} {book.price.currency}
                      </Badge>
                    ) : book.price ? (
                      <Badge className="bg-green-100 text-green-700 w-fit">
                        {book.price}
                      </Badge>
                    ) : null}
                    {book.rating !== undefined && (
                      <p className="text-sm text-yellow-600">
                        ⭐ {book.rating.toFixed(1)}/5
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ← Précédent
            </Button>
            <span className="text-sm pt-2">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Suivant →
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
