import { Link } from 'react-router-dom'

function SectionHeader({ eyebrow, eyebrowClass, title, accent, accentClass, subtitle, viewAll }) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`font-semibold uppercase tracking-wider text-sm bg-gradient-to-r ${eyebrowClass} text-transparent bg-clip-text`}>
          {eyebrow}
        </p>
        <h2 className="text-4xl sm:text-5xl font-black mt-1">
          <span className="text-white">{title}</span>{" "}
          <span className={accentClass}>{accent}</span>
        </h2>
        {subtitle && <p className="mt-2 text-sm text-gray-500 max-w-md">{subtitle}</p>}
      </div>
      {viewAll && (
        <Link to={viewAll} className="group rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white hover:border-white/20 backdrop-blur-sm">
          View All
          <span className="inline-block ml-1.5 transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      )}
    </div>
  )
}

export default SectionHeader
