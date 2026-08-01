import { Link } from 'react-router-dom'
import { FaClapperboard } from 'react-icons/fa6'
import ImageWithFallback from '@/components/ui/ImageWithFallback'
import TiltCard from '@/components/ui/TiltCard'
import { getPublicImageUrl } from '@/services/seller'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'

function LocalMovieCard({ movie, index = 0 }) {
  return (
    <TiltCard
      maxTilt={8}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      <Link to={ROUTES.LOCAL_MOVIE_DETAIL(movie.id)} className="group block overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5 transition-all duration-500 hover:ring-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
          <div className="absolute inset-0 shimmer opacity-30 group-hover:opacity-0 transition-opacity duration-500" />
          <ImageWithFallback src={getPublicImageUrl(movie.image)} alt={movie.title} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
            <FaClapperboard size={9} /> LOCAL
          </span>
        </div>
        <div className="p-3">
          <p className="line-clamp-1 text-sm font-medium text-white">{movie.title}</p>
          <p className="mt-0.5 text-xs text-gray-500 truncate">{movie.seller?.name || 'Local creator'}</p>
          <p className="mt-1 text-xs font-bold text-amber-400">{formatCurrency(movie.price)}</p>
        </div>
      </Link>
    </TiltCard>
  )
}

export default LocalMovieCard
