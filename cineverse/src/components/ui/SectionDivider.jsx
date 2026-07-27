function SectionDivider() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-violet-500/40 via-fuchsia-500/40 to-pink-500/40 blur-sm" />
        </div>
      </div>
    </div>
  )
}

export default SectionDivider
