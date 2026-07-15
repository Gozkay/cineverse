function MovieSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-white/5">
      <div className="aspect-[3/4] bg-slate-800/80 shimmer" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-3/4 rounded-full bg-slate-800/80 shimmer" />
        <div className="h-2 w-1/2 rounded-full bg-slate-800/80 shimmer" />
        <div className="h-3 w-1/3 rounded-full bg-slate-800/80 shimmer" />
      </div>
    </div>
  );
}

export default MovieSkeleton;
