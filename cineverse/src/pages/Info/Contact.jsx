import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import Seo from '@/components/Seo'
import { FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa'

const SUPPORT_EMAIL = 'stompiddo3@gmail.com'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(form.subject || `CineVerse enquiry from ${form.name || 'a visitor'}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <MainLayout>
      <Seo title="Contact Us" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl sm:text-5xl font-black">
          <span className="text-white">Contact</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Us</span>
        </h1>
        <p className="mt-3 text-gray-500 max-w-2xl">
          Questions about an order, a refund, or becoming a seller? We usually reply within 24 hours.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                <FaEnvelope size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-white hover:text-violet-400 transition-colors">{SUPPORT_EMAIL}</a>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                <FaMapMarkerAlt size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm text-white">Lagos, Nigeria</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <FaClock size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Support hours</p>
                <p className="text-sm text-white">Mon – Sat, 9:00 AM – 6:00 PM (WAT)</p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
              <p className="text-xs text-gray-500">Before you write in</p>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-400">
                <li>• Track your order from your profile — order status and digital downloads live there.</li>
                <li>• Check the <a href="/faq" className="text-violet-400 hover:text-violet-300">FAQ</a> for quick answers about payments, refunds and downloads.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-slate-900/50 p-6 ring-1 ring-slate-800">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-gray-400">Your name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Jane Doe" className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Your email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Subject</label>
              <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Order enquiry, refund, seller question..." className="h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 text-sm text-white outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Message</label>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder="How can we help?" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-violet-500 resize-none" />
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-fuchsia-500 transition-all">
              <FaPaperPlane size={13} /> Send message
            </button>
            <p className="text-xs text-gray-600">Sending opens your email app with the message pre-filled — press send there to deliver it.</p>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}

export default Contact
