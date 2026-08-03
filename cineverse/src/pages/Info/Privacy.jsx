import MainLayout from '@/components/layout/MainLayout'
import Seo from '@/components/Seo'

const sections = [
  {
    title: '1. Information we collect',
    body: 'When you create an account we collect your name, email address and a password (stored securely by our authentication provider). When you place an order we store your order items, totals and shipping information. If you sign in with Google, we receive the basic profile information you approve (name, email and avatar).',
  },
  {
    title: '2. How we use your information',
    body: 'We use your information to operate your account, process and fulfil orders, manage digital downloads, deliver coupons and platform notifications, prevent fraud and abuse, and improve the platform. We do not sell your personal data to anyone.',
  },
  {
    title: '3. Payments',
    body: 'Card payments are processed by Paystack, our payment provider. We never see or store your full card details — card data is handled entirely by Paystack under their own security policies. Bank transfers are confirmed against your order reference.',
  },
  {
    title: '4. Third-party services',
    body: 'The platform uses Supabase for authentication, the database and file storage; Google Books, TMDB, Jikan and Open Library to source product information; and Paystack for payments. Each service processes only the data needed for its function and under its own terms.',
  },
  {
    title: '5. Cookies and local storage',
    body: 'We use browser local storage to remember your cart and wishlist and to keep you signed in. We do not run third-party advertising trackers.',
  },
  {
    title: '6. Data retention and deletion',
    body: 'You can delete your account from your profile at any time. Account deletion removes your profile, orders, reviews and personal data from our systems. Certain financial records may be retained where legally required.',
  },
  {
    title: '7. Your rights',
    body: 'You may request a copy of the personal data we hold about you, correct inaccurate information, or ask for your data to be deleted. To exercise any of these rights, contact us from the Contact page.',
  },
  {
    title: '8. Contact',
    body: 'Questions about this policy? Reach us from the Contact page and we will respond within 24 hours.',
  },
]

function Privacy() {
  return (
    <MainLayout>
      <Seo title="Privacy Policy" />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl sm:text-5xl font-black">
          <span className="text-white">Privacy</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Policy</span>
        </h1>
        <p className="mt-3 text-gray-500">Last updated: August 2026</p>

        <div className="mt-10 space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
              <h2 className="text-sm font-semibold text-white">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default Privacy