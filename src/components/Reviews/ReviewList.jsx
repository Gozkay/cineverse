import { useState, useEffect } from 'react'
import { FaStar, FaTrash } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { formatDateTime } from '@/utils/formatDate'
import toast from 'react-hot-toast'

function ReviewList({ productId, refreshKey }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    loadReviews()
  }, [productId, refreshKey])

  async function loadReviews() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles:user_id(name, avatar)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }

  const handleDelete = async (reviewId) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
    if (error) { toast.error('Failed to delete'); return }
    toast.success('Review deleted')
    loadReviews()
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) {
    return <div className="text-sm text-gray-500">Loading reviews...</div>
  }

  return (
    <div className="space-y-4">
      {reviews.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" size={18} />
            <span className="text-lg font-bold text-white">{averageRating}</span>
          </div>
          <span className="text-sm text-gray-400">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl bg-slate-900/30 p-4 ring-1 ring-white/5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                    {review.profiles?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {review.profiles?.name || 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} size={12} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-600'} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">{formatDateTime(review.created_at)}</span>
                  {(isAdmin || review.user_id === user?.id) && (
                    <button onClick={() => handleDelete(review.id)} className="text-red-400 hover:text-red-300">
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewList
