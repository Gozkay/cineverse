import { supabase } from '@/lib/supabase'

async function resizeToJpeg(file, maxSize = 256) {
  const image = await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = reject
    img.src = url
  })

  const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
  const w = Math.max(1, Math.round(image.width * scale))
  const h = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(image, 0, 0, w, h)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.85)
  })
}

export async function uploadAvatar(file) {
  if (!file) throw new Error('Please choose an image file')
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file')
  if (file.size > 4 * 1024 * 1024) throw new Error('Image must be under 4MB')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('You must be signed in')

  const blob = await resizeToJpeg(file)
  const path = `${user.id}/avatar-${Date.now()}.jpg`

  const { error } = await supabase.storage.from('avatars').upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return data.publicUrl
}

export function avatarImageUrl(profile) {
  return profile?.avatar || null
}