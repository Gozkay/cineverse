import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      const timer = setTimeout(() => navigate(ROUTES.HOME, { replace: true }), 1500)
      return () => clearTimeout(timer)
    } else {
      navigate(ROUTES.HOME, { replace: true })
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
    </div>
  )
}

export default Callback
