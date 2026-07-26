import { useEffect } from 'react'
import { syncProduct } from '@/utils/syncProduct'

export function useSyncProduct(product) {
  useEffect(() => {
    if (product) syncProduct(product)
  }, [product])
}
