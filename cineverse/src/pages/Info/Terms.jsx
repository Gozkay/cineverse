import MainLayout from '@/components/layout/MainLayout'
import Seo from '@/components/Seo'

const sections = [
  {
    title: '1. Acceptance of terms',
    body: 'By creating an account or using the CineVerse platform you agree to these Terms of Service. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. Accounts',
    body: 'You are responsible for keeping your login credentials secure and for all activity that happens under your account. You must be at least 13 years old to create an account. We may suspend or close accounts that break these terms or our security policies.',
  },
  {
    title: '3. Orders and payment',
    body: 'All prices are displayed in Nigerian Naira (NGN). An order is confirmed when it is placed; payment is processed via Paystack. Orders remain pending until payment is confirmed. We may cancel or refund orders that appear fraudulent or that we cannot fulfil.',
  },
  {
    title: '4. Digital content and downloads',
    body: 'Digital downloads are licensed to you for personal, non-commercial use. You may not copy, redistribute or re-sell downloaded content. Download links are valid for a limited time and tied to your account.',
  },
  {
    title: '5. Coupons and promotions',
    body: 'Coupons and promotions are subject to their stated terms, including minimum order values, expiry dates and usage limits. We reserve the right to withdraw or correct promotional offers that were issued in error.',
  },
  {
    title: '6. Seller terms',
    body: 'Sellers who list products agree to provide accurate listings and comply with moderation. A platform commission applies to each paid sale. Payouts are subject to a minimum withdrawal amount and payment-provider verification. We may remove listings that violate platform rules.',
  },
  {
    title: '7. Prohibited conduct',
    body: 'You may not attempt to gain unauthorised access to the platform or other accounts, interfere with the platform\'s operation, post unlawful content, or use the platform to commit fraud.',
  },
  {
    title: '8. Limitation of liability',
    body: 'The platform is provided "as is". To the maximum extent permitted by law, we are not liable for indirect or consequential losses arising from your use of the platform, product information sourced from third parties, or any unavailable third-party service.',
  },
  {
    title: '9. Changes to these terms',
    body: 'We may update these terms from time to time. Material changes will be reflected on this page with an updated date. Continued use of the platform after changes means you accept the revised terms.',
  },
  {
    title: '10. Contact',
    body: 'Questions about these terms? Reach us from the Contact page.',
  },
]

function Terms() {
  return (
    <MainLayout>
      <Seo title="Terms of Service" />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl sm:text-5xl font-black">
          <span className="text-white">Terms of</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Service</span>
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

export default Terms