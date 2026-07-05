function MovieSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-slate-900">
      <div className="h-[420px] bg-slate-800"></div>

      <div className="space-y-3 p-5">
        <div className="h-6 rounded bg-slate-700"></div>
        <div className="h-4 w-1/2 rounded bg-slate-700"></div>
      </div>
    </div>
  );
}

export default MovieSkeleton;