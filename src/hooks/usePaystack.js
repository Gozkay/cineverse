import { useCallback } from 'react'

export function usePaystack() {
  const initializePayment = useCallback(({ email, amount, onSuccess, onClose }) => {
    if (!window.PaystackPop) {
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = () => openPaystack({ email, amount, onSuccess, onClose })
      document.body.appendChild(script)
      return
    }
    openPaystack({ email, amount, onSuccess, onClose })
  }, [])

  return { initializePayment }
}

function openPaystack({ email, amount, onSuccess, onClose }) {
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(amount * 100),
    currency: 'NGN',
    ref: 'cineverse_' + Date.now(),
    callback: (response) => {
      onSuccess?.(response.reference)
    },
    onClose: () => {
      onClose?.()
    },
  })
  handler.openIframe()
}
