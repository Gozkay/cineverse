import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
      <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text">
              CineVerse
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your ultimate marketplace for movies, books, manga, and comics. Discover your next adventure.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Browse</h4>
            <ul className="space-y-2">
              {[
                { name: 'Movies', path: ROUTES.MOVIES },
                { name: 'Books', path: ROUTES.BOOKS },
                { name: 'Manga', path: ROUTES.MANGA },
                { name: 'Comics', path: ROUTES.COMICS },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-gray-500 hover:text-violet-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Account</h4>
            <ul className="space-y-2">
              <li><Link to={ROUTES.LOGIN} className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Login</Link></li>
              <li><Link to={ROUTES.REGISTER} className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Register</Link></li>
              <li><Link to={ROUTES.CART} className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Cart</Link></li>
              <li><Link to={ROUTES.WISHLIST} className="text-sm text-gray-500 hover:text-violet-400 transition-colors">Wishlist</Link></li>
              <li><Link to={ROUTES.BECOME_SELLER} className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">Become a Seller</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">Support</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500">Contact Us</span></li>
              <li><span className="text-sm text-gray-500">FAQ</span></li>
              <li><span className="text-sm text-gray-500">Privacy Policy</span></li>
              <li><span className="text-sm text-gray-500">Terms of Service</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} CineVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
