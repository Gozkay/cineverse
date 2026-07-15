import axios from 'axios'

const googleBooks = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
})

export async function searchBooks(query, maxResults = 20) {
  const { data } = await googleBooks.get('/volumes', {
    params: { q: query, maxResults, langRestrict: 'en' },
  })
  return (data.items || []).map(normalizeBook)
}

export async function getBookById(id) {
  const { data } = await googleBooks.get(`/volumes/${id}`)
  return normalizeBook(data)
}

export async function getBooksByCategory(category = 'fiction', maxResults = 20) {
  return searchBooks(`subject:${category}`, maxResults)
}

function normalizeBook(item) {
  const info = item.volumeInfo || {}
  return {
    id: item.id,
    title: info.title || 'Unknown Title',
    authors: info.authors || ['Unknown Author'],
    description: info.description || 'No description available.',
    image: info.imageLinks?.thumbnail?.replace('http:', 'https:') || info.imageLinks?.smallThumbnail?.replace('http:', 'https:') || '/placeholder-book.svg',
    categories: info.categories || ['General'],
    pageCount: info.pageCount || 0,
    publishedDate: info.publishedDate || 'N/A',
    publisher: info.publisher || 'Unknown',
    language: info.language || 'en',
    averageRating: info.averageRating || 0,
    ratingsCount: info.ratingsCount || 0,
    price: Math.floor(Math.random() * 4000) + 1500,
    currency: 'NGN',
    category: 'book',
    previewLink: info.previewLink || '#',
    infoLink: info.infoLink || '#',
  }
}
