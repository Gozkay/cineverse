import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import 'dotenv/config'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
)

const TMDB_TOKEN = process.env.VITE_TMDB_TOKEN

function hashPrice(id, min, range) {
  const n = typeof id === 'number'
    ? id
    : parseInt(String(id).slice(-8), 36) || 1
  return (n % range) + min
}

async function seedMovies() {
  console.log('Seeding movies...')
  const { data } = await axios.get('https://api.themoviedb.org/3/trending/movie/week', {
    headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
  })
  const movies = data.results.map((m) => ({
    external_id: String(m.id),
    title: m.title,
    description: m.overview,
    price: hashPrice(m.id, 2000, 2000),
    category: 'movie',
    image: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
    rating: m.vote_average,
    rating_count: m.vote_count,
    metadata: { release_date: m.release_date, media_type: m.media_type },
  }))

  const { error } = await supabase.from('products').upsert(movies, {
    onConflict: 'category, external_id',
    ignoreDuplicates: false,
  })
  if (error) console.error('Movie seed error:', error.message)
  else console.log(`  Inserted ${movies.length} movies`)
}

async function seedBooks() {
  console.log('Seeding books...')
  const { data } = await axios.get('https://www.googleapis.com/books/v1/volumes', {
    params: { q: 'subject:fiction', maxResults: 40, langRestrict: 'en' },
  })
  const books = (data.items || []).map((item) => {
    const info = item.volumeInfo || {}
    return {
      external_id: item.id,
      title: info.title || 'Unknown',
      description: info.description || '',
      price: hashPrice(item.id, 1500, 2500),
      category: 'book',
      image: info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
      rating: info.averageRating || 0,
      rating_count: info.ratingsCount || 0,
      metadata: {
        authors: info.authors || [],
        publisher: info.publisher,
        pageCount: info.pageCount,
      },
    }
  })

  const { error } = await supabase.from('products').upsert(books, {
    onConflict: 'category, external_id',
    ignoreDuplicates: false,
  })
  if (error) console.error('Book seed error:', error.message)
  else console.log(`  Inserted ${books.length} books`)
}

async function seedManga() {
  console.log('Seeding manga...')
  const { data } = await axios.get('https://api.jikan.moe/v4/top/manga', {
    params: { page: 1, limit: 25 },
  })
  const manga = (data.data || []).map((item) => ({
    external_id: String(item.mal_id),
    title: item.title || item.title_english || 'Unknown',
    description: item.synopsis || '',
    price: hashPrice(item.mal_id, 1000, 2000),
    category: 'manga',
    image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
    rating: item.score || 0,
    rating_count: item.scored_by || 0,
    metadata: {
      authors: item.authors?.map((a) => a.name) || [],
      chapters: item.chapters,
      volumes: item.volumes,
      status: item.status,
    },
  }))

  const { error } = await supabase.from('products').upsert(manga, {
    onConflict: 'category, external_id',
    ignoreDuplicates: false,
  })
  if (error) console.error('Manga seed error:', error.message)
  else console.log(`  Inserted ${manga.length} manga`)
}

async function seedComics() {
  console.log('Seeding comics...')
  const { data } = await axios.get('https://openlibrary.org/subjects/comics.json', {
    params: { limit: 25 },
  })
  const comics = (data.works || []).map((work) => {
    const id = work.key?.replace('/works/', '') || ''
    return {
      external_id: id,
      title: work.title || 'Unknown',
      description: `A comic work first published in ${work.first_publish_year || 'unknown year'}.`,
      price: hashPrice(id, 1200, 2300),
      category: 'comic',
      image: work.cover_id
        ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
        : null,
      rating: 0,
      rating_count: 0,
      metadata: {
        authors: work.authors?.map((a) => a.name) || [],
        firstPublishYear: work.first_publish_year,
      },
    }
  })

  const { error } = await supabase.from('products').upsert(comics, {
    onConflict: 'category, external_id',
    ignoreDuplicates: false,
  })
  if (error) console.error('Comic seed error:', error.message)
  else console.log(`  Inserted ${comics.length} comics`)
}

async function main() {
  console.log('Starting product seed...\n')
  await seedMovies()
  await seedBooks()
  await seedManga()
  await seedComics()
  console.log('\nSeed complete!')
}

main().catch(console.error)
