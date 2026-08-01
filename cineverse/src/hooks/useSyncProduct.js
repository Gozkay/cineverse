import { useEffect } from 'react'
import { syncProduct } from '@/utils/syncProduct'

export function useSyncProduct(product) {
  useEffect(() => {
    if (product?.title) syncProduct(product)
  }, [product])
}
