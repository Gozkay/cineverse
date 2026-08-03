import MainLayout from '@/components/layout/MainLayout'
import Seo from '@/components/Seo'
import { FaChevronDown } from 'react-icons/fa'

const faqs = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept card payments securely through Paystack, plus bank transfer and bank deposit for orders over a set threshold. Card payments are processed in test mode during development using the demo card.',
  },
  {
    q: 'How do I get my digital movie or download?',
    a: 'Once an order is marked paid, the download appears under Orders in your profile. Digital downloads are available for movie products and are linked to your account.',
  },
  {
    q: 'Why does my order still show as pending after paying with card?',
    a: 'A card order is marked paid when Paystack confirms the charge. If it stays pending, the confirmation may not have come through — contact us from the Contact page and we will sort it out within 24 hours.',
  },
  {
    q: 'How long is a download link valid?',
    a: 'Digital download links are valid for 1 hour after they are generated. If your link expires, revisit your order in your profile to generate a fresh one.',
  },
  {
    q: 'How do I get a refund?',
    a: 'Request a refund from your order page. Refund requests are reviewed by our team and approved refunds are processed to the method that was used to pay.',
  },
  {
    q: 'How do discount coupons work?',
    a: 'Enter a coupon code at checkout to receive a percentage or fixed discount. Some coupons have a minimum order amount, an expiry date, or a limited number of uses.',
  },
  {
    q: 'How do I become a seller?',
    a: 'Click "Become a Seller" from your account menu, choose Seller or Movie Producer, and submit your application. An admin approves your request before you can list products.',
  },
  {
    q: 'When is my product or payout approved?',
    a: 'Seller product listings go through a quick moderation check before going live. Payouts have a minimum withdrawal amount and are initiated by an admin, then confirmed by our payment provider.',
  },
  {
    q: 'How do I reset my password?',
    a: 'On the login page, choose "Forgot password". You will receive a link to set a new password in your inbox.',
  },
  {
    q: 'Where can I track my order?',
    a: 'Every order you place appears in your profile. Order statuses move from pending to paid, then processing, shipped and delivered.',
  },
]

function FAQ() {
  return (
    <MainLayout>
      <Seo title="FAQ" />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl sm:text-5xl font-black">
          <span className="text-white">Frequently Asked</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Questions</span>
        </h1>
        <p className="mt-3 text-gray-500">
          Quick answers to the things we get asked most.
        </p>

        <div className="mt-10 space-y-3">
          {faqs.map((item, i) => (
            <details key={i} className="group rounded-xl bg-slate-900/50 ring-1 ring-slate-800 open:ring-violet-500/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-white select-none">
                {item.q}
                <FaChevronDown size={12} className="shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="border-t border-slate-800 px-5 py-4 text-sm leading-relaxed text-gray-400">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default FAQ