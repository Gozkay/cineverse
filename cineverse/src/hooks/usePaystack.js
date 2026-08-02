import { useCallback } from 'react'

let paystackScriptLoaded = false
let refCounter = 0

export function usePaystack() {
  const initializePayment = useCallback(({ email, amount, onSuccess, onClose, onError }) => {
    const run = () => {
      try {
        openPaystack({ email, amount, onSuccess, onClose })
      } catch (e) {
        onError?.(e?.message || 'Paystack could not be initialized')
      }
    }
    if (window.PaystackPop) {
      run()
      return
    }
    if (!paystackScriptLoaded) {
      paystackScriptLoaded = true
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.onload = run
      script.onerror = () => {
        paystackScriptLoaded = false
        onError?.('Could not load Paystack. Check your connection or ad blocker.')
      }
      document.body.appendChild(script)
      return
    }
    const checkInterval = setInterval(() => {
      if (window.PaystackPop) {
        clearInterval(checkInterval)
        run()
      }
    }, 200)
    setTimeout(() => clearInterval(checkInterval), 10000)
  }, [])

  return { initializePayment }
}

function openPaystack({ email, amount, onSuccess, onClose }) {
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(amount * 100),
    currency: 'NGN',
    ref: 'cineverse_' + Date.now() + '_' + (++refCounter),
    callback: (response) => {
      onSuccess?.(response.reference)
    },
    onClose: () => {
      onClose?.()
    },
  })
  handler.openIframe()
}
