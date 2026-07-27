function ProductSkeleton({ count = 10, className = '' }) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-slate-900/40 ring-1 ring-white/5 overflow-hidden">
          <div className="aspect-[3/4] bg-slate-800/80 shimmer" />
          <div className="space-y-2.5 p-4">
            <div className="h-3 w-3/4 rounded-full bg-slate-800/80 shimmer" />
            <div className="h-2.5 w-1/2 rounded-full bg-slate-800/80 shimmer" />
            <div className="h-3 w-1/3 rounded-full bg-slate-800/80 shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductSkeleton
