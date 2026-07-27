import { useState } from 'react'

const PLACEHOLDER = 'https://placehold.co/300x400?text=No+Image'

function ImageWithFallback({ src, alt, className = '', containerClassName = '', ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-800 shimmer" />
      )}
      <img
        src={error ? PLACEHOLDER : src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setError(true) }}
        loading="lazy"
        {...props}
      />
    </div>
  )
}

export default ImageWithFallback
