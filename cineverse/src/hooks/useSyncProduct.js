import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { syncProduct } from '@/utils/syncProduct'

export function useSyncProduct(product) {
  const { isAdmin } = useAuth()

  const productKey = product
    ? JSON.stringify([product?.id, product?.title, product?.description, product?.category, product?.image, product?.rating, product?.rating_count])
    : null

  useEffect(() => {
    if (!product?.title || !productKey) return
    if (!isAdmin) return
    syncProduct(product)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productKey, isAdmin])
}
