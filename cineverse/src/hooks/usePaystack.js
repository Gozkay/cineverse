import { useCallback } from 'react'

let paystackScriptLoaded = false

export function usePaystack() {
  const initializePayment = useCallback(({ email, amount, onSuccess, onClose }) => {
    if (window.PaystackPop) {
      openPaystack({ email, amount, onSuccess, onClose })
      return
    }
    if (!paystackScriptLoaded) {
      paystackScriptLoaded = true
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = () => openPaystack({ email, amount, onSuccess, onClose })
      document.body.appendChild(script)
      return
    }
    const checkInterval = setInterval(() => {
      if (window.PaystackPop) {
        clearInterval(checkInterval)
        openPaystack({ email, amount, onSuccess, onClose })
      }
    }, 200)
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
