import axios from 'axios'

const ANILIST_URL = 'https://graphql.anilist.co'

const MEDIA_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  description
  coverImage {
    extraLarge
    large
  }
  averageScore
  popularity
  favourites
  genres
  chapters
  volumes
  status
  format
  startDate {
    year
    month
    day
  }
  staff {
    edges {
      role
      node {
        name {
          full
        }
      }
    }
  }
`

const PAGE_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(type: MANGA, search: $search, sort: $sort, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`

const BY_ID_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: MANGA) {
      ${MEDIA_FIELDS}
    }
  }
`

const RANK_QUERY = `
  query ($page: Int, $perPage: Int, $pop: Int) {
    Page(page: $page, perPage: $perPage) {
      media(popularity_greater: $pop, type: MANGA, isAdult: false, sort: [POPULARITY]) { id }
    }
  }
`

async function anilist(query, variables) {
  const { data } = await axios.post(ANILIST_URL, { query, variables }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })
  if (data.errors) {
    throw new Error(data.errors.map(e => e.message).join('; '))
  }
  return data
}

export async function getTopManga(page = 1, limit = 20) {
  const data = await anilist(PAGE_QUERY, {
    page,
    perPage: limit,
    sort: ['POPULARITY_DESC'],
  })
  return (data.data?.Page?.media || []).map(normalizeManga)
}

export async function getMangaById(id) {
  const data = await anilist(BY_ID_QUERY, { id: Number(id) })
  const manga = normalizeManga(data.data?.Media)
  if (manga && manga.popularity) {
    manga.rank = await computePopularityRank(manga.popularity)
  }
  return manga
}

async function rankPage(page, popularity) {
  const data = await anilist(RANK_QUERY, { page, perPage: 50, pop: popularity })
  return data.data?.Page?.media || []
}

async function computePopularityRank(popularity) {
  const pages = [await rankPage(1, popularity)]
  if (pages[0].length === 50) {
    pages.push(...(await Promise.all([2, 3, 4].map(p => rankPage(p, popularity)))))
  }
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].length < 50) return 50 * i + pages[i].length + 1
  }
  return null
}

export async function searchManga(query, page = 1) {
  const data = await anilist(PAGE_QUERY, {
    page,
    perPage: 20,
    search: query,
    sort: ['SEARCH_MATCH'],
  })
  return (data.data?.Page?.media || []).map(normalizeManga)
}

function stripHtml(text) {
  return (text || '')
    .replace(/~![^!]*!~/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatStatus(status) {
  const map = {
    RELEASING: 'publishing',
    FINISHED: 'finished',
    CANCELLED: 'cancelled',
    HIATUS: 'hiatus',
    NOT_YET_RELEASED: 'not yet released',
  }
  return map[status] || (status || 'Unknown').toLowerCase().replace(/_/g, ' ')
}

function formatType(format) {
  const map = {
    MANGA: 'Manga',
    MANHWA: 'Manhwa',
    MANHUA: 'Manhua',
    NOVEL: 'Light Novel',
    ONE_SHOT: 'One Shot',
  }
  return map[format] || 'Manga'
}

function formatDate(startDate) {
  if (!startDate?.year) return 'N/A'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const date = new Date(startDate.year, (startDate.month || 1) - 1, startDate.day || 1)
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function normalizeManga(item) {
  if (!item) return null
  const authors = item.staff?.edges
    ?.filter(e => /story|art/i.test(e.role || ''))
    .map(e => e.node?.name?.full)
    .filter(Boolean) || []
  return {
    id: item.id,
    malId: item.id,
    title: item.title?.romaji || item.title?.english || 'Unknown Title',
    titleJapanese: item.title?.native || '',
    authors: authors.length > 0 ? authors : ['Unknown'],
    description: stripHtml(item.description) || 'No description available.',
    image: item.coverImage?.extraLarge || item.coverImage?.large || '/placeholder-manga.svg',
    score: item.averageScore ? item.averageScore / 10 : 0,
    scoredBy: item.favourites || 0,
    rank: 0,
    popularity: item.popularity || 0,
    genres: item.genres || [],
    themes: [],
    chapters: item.chapters || 0,
    volumes: item.volumes || 0,
    status: formatStatus(item.status),
    published: formatDate(item.startDate),
    type: formatType(item.format),
    price: (item.id ? (item.id % 2000) + 1000 : 1000),
    currency: 'NGN',
    category: 'manga',
  }
}
