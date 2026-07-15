import axios from 'axios'

const jikan = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
})

export async function getTopManga(page = 1, limit = 20) {
  const { data } = await jikan.get('/top/manga', {
    params: { page, limit },
  })
  return (data.data || []).map(normalizeManga)
}

export async function getMangaById(id) {
  const { data } = await jikan.get(`/manga/${id}/full`)
  return normalizeManga(data.data)
}

export async function searchManga(query, page = 1) {
  const { data } = await jikan.get('/manga', {
    params: { q: query, page, limit: 20 },
  })
  return (data.data || []).map(normalizeManga)
}

function normalizeManga(item) {
  return {
    id: `manga_${item.mal_id}`,
    malId: item.mal_id,
    title: item.title || item.title_english || 'Unknown Title',
    titleJapanese: item.title_japanese || '',
    authors: item.authors?.map(a => a.name) || ['Unknown'],
    description: item.synopsis || 'No description available.',
    image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '/placeholder-manga.svg',
    score: item.score || 0,
    scoredBy: item.scored_by || 0,
    rank: item.rank || 0,
    popularity: item.popularity || 0,
    genres: item.genres?.map(g => g.name) || [],
    themes: item.themes?.map(t => t.name) || [],
    chapters: item.chapters || 0,
    volumes: item.volumes || 0,
    status: item.status || 'Unknown',
    published: item.published?.string || 'N/A',
    type: item.type || 'Manga',
    price: Math.floor(Math.random() * 3000) + 1000,
    currency: 'NGN',
    category: 'manga',
  }
}
