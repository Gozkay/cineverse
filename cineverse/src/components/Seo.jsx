import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'CineVerse'
const DEFAULT_DESC = 'Discover and shop movies, books, manga, and comics — your ultimate entertainment marketplace.'
const DEFAULT_IMG = '/og-image.png'

export default function Seo({ title, description, image, noIndex }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const desc = description || DEFAULT_DESC
  const img = image || DEFAULT_IMG

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  )
}
