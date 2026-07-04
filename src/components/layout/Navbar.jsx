import { NavLink } from "react-router-dom";
import { FaBars, FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";

function Navbar() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/products" },
    { name: "Books", path: "/products" },
    { name: "Manga", path: "/products" },
    { name: "Comics", path: "/products" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-slate-950">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-violet-500"
        >
          🎬 CineVerse
        </NavLink>

        {/* Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-violet-500 font-semibold"
                    : "text-gray-300 hover:text-violet-400 transition"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="hidden items-center gap-5 md:flex">
          <FaSearch
            className="cursor-pointer text-xl text-gray-300 hover:text-violet-500"
          />

          <FaShoppingCart
            className="cursor-pointer text-xl text-gray-300 hover:text-violet-500"
          />

          <FaUser
            className="cursor-pointer text-xl text-gray-300 hover:text-violet-500"
          />
        </div>

        {/* Mobile Menu Icon */}
        <button className="text-2xl text-white md:hidden">
          <FaBars />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;