import axios from 'axios'

const openLibrary = axios.create({
  baseURL: 'https://openlibrary.org',
})

export async function getComicsBySubject(subject = 'comics', limit = 20) {
  const { data } = await openLibrary.get(`/subjects/${subject}.json`, {
    params: { limit },
  })
  return (data.works || []).map(work => normalizeComic(work, subject))
}

export async function searchComics(query, limit = 20) {
  const { data } = await openLibrary.get('/search.json', {
    params: { q: `${query} comics`, limit },
  })
  return (data.docs || []).map(normalizeComicSearch)
}

async function getBookDetails(olid) {
  try {
    const { data } = await openLibrary.get(`/works/${olid}.json`)
    return data
  } catch {
    return null
  }
}

function normalizeComic(work, subject) {
  return {
    id: work.key?.replace('/works/', '') || `comic_${Date.now()}`,
    title: work.title || 'Unknown Title',
    authors: work.authors?.map(a => a.name) || ['Unknown'],
    coverId: work.cover_id || null,
    image: work.cover_id
      ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
      : '/placeholder-comic.svg',
    subjects: [subject, ...(work.subject ? work.subject : [])],
    editionCount: work.edition_count || 0,
    firstPublishYear: work.first_publish_year || 'N/A',
    price: Math.floor(Math.random() * 3500) + 1200,
    currency: 'NGN',
    category: 'comic',
    description: `A comic work in the ${subject} category. First published in ${work.first_publish_year || 'unknown year'}.`,
  }
}

function normalizeComicSearch(doc) {
  return {
    id: doc.key?.replace('/works/', '') || `comic_${Date.now()}`,
    title: doc.title || 'Unknown Title',
    authors: doc.author_name || ['Unknown'],
    coverId: doc.cover_i || null,
    image: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : '/placeholder-comic.svg',
    subjects: doc.subject || ['Comics'],
    editionCount: doc.edition_count || 0,
    firstPublishYear: doc.first_publish_year || 'N/A',
    price: Math.floor(Math.random() * 3500) + 1200,
    currency: 'NGN',
    category: 'comic',
    description: doc.description || doc.first_sentence?.[0] || `A comic work first published in ${doc.first_publish_year || 'unknown year'}.`,
  }
}
