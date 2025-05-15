import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Search, SlidersHorizontal, Star, Clock, DollarSign } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useApiQuery } from '@/hooks/useApi'
import { SearchResponse } from '@/types/types'

const SearchResults = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('q') || ''

  const [query, setQuery] = useState(searchQuery)
  const [sortOption, setSortOption] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const { data, isLoading, isError } = useApiQuery<SearchResponse>(
    ['searchResults', searchQuery],
    '/search',
    { query: searchQuery },
    {
      enabled: !!searchQuery,
    },
  )

  const restaurants = data.restaurants || []
  const dishes = data.menuItems || []

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
    // Sorting logic can be implemented here if needed
  }

  const totalPages = Math.ceil((restaurants.length + dishes.length) / itemsPerPage)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Search results for '{searchQuery}'</h1>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for food or restaurants"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit">
              <Search className="mr-2" size={18} />
              Search
            </Button>
          </form>
        </div>

        <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">
            {restaurants.length} restaurants, {dishes.length} dishes found
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="delivery">Delivery Time</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading data</div>}

        {!isLoading && !isError && (
          <>
            {restaurants.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.slice(0, itemsPerPage).map((restaurant) => (
                    <Link
                      to={`/restaurant/${restaurant.restaurant_id}`}
                      key={restaurant.restaurant_id}
                    >
                      <Card className="overflow-hidden hover-scale card-shadow h-full hover:shadow-md transition-all">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={restaurant.image_url}
                            alt={restaurant.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium text-foodsnap-orange">
                            {restaurant.rating}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-bold">{restaurant.name}</h3>
                            <div className="flex items-center">
                              <Star
                                size={16}
                                className="text-yellow-400 mr-1"
                                fill="currentColor"
                              />
                              <span>{restaurant.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>
                                {restaurant.open_time} - {restaurant.close_time}
                              </span>
                            </div>
                            <span className="text-foodsnap-teal font-medium">View Menu</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {dishes.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Dishes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dishes.slice(0, itemsPerPage).map((dish) => (
                    <Link to={`/restaurant/${dish.restaurant_id}`} key={dish.menuitem_id}>
                      <Card className="overflow-hidden hover-scale card-shadow">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold mb-1">{dish.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{dish.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="font-medium text-foodsnap-orange flex items-center">
                              <DollarSign size={14} className="mr-0.5" />
                              {(dish.price / 1000).toFixed(3)}k
                            </div>
                            <span className="text-foodsnap-teal font-medium">View Restaurant</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {totalPages > 1 && (
          <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(index + 1)
                    }}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default SearchResults
