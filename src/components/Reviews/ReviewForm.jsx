import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

function ReviewForm({ productId, onReviewAdded }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    return (
      <p className="text-sm text-gray-500">
        <a href="/login" className="text-violet-400 hover:underline">Sign in</a> to leave a review
      </p>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { toast.error('Please select a rating'); return }
    if (!comment.trim()) { toast.error('Please write a comment'); return }

    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      product_id: productId,
      rating,
      comment: comment.trim(),
    }).select().single()

    setSubmitting(false)

    if (error) {
      if (error.code === '23505') {
        toast.error('You already reviewed this product')
      } else {
        toast.error('Failed to submit review')
      }
      return
    }

    toast.success('Review submitted!')
    setRating(0)
    setComment('')
    onReviewAdded?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
      <h3 className="text-sm font-semibold text-white">Write a Review</h3>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-colors"
          >
            <FaStar
              size={20}
              className={(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-600'}
            />
          </button>
        ))}
        <span className="ml-2 text-xs text-gray-400">
          {rating > 0 ? `${rating}/5` : 'Click to rate'}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this product..."
        rows={3}
        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none focus:border-violet-500 resize-none"
      />

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default ReviewForm
