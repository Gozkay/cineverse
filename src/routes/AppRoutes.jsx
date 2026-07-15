import { Routes, Route } from "react-router-dom";

import Home from "@/pages/Home/Home";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import NotFound from "@/pages/NotFound/NotFound";
import Cart from "@/pages/Cart/Cart";
import Checkout from "@/pages/Checkout/Checkout";
import Wishlist from "@/pages/Wishlist/Wishlist";
import Profile from "@/pages/Profile/Profile";
import Search from "@/pages/Search/Search";

import Movies from "@/pages/Movies/Movies";
import MovieDetails from "@/pages/Movies/MovieDetails";

import Books from "@/pages/Books/Books";
import BookDetails from "@/pages/Books/BookDetails";

import Manga from "@/pages/Manga/Manga";
import MangaDetails from "@/pages/Manga/MangaDetails";

import Comics from "@/pages/Comics/Comics";
import ComicDetails from "@/pages/Comics/ComicDetails";

import AdminDashboard from "@/pages/dashboard/Admin/Dashboard";
import AdminProducts from "@/pages/dashboard/Admin/Products";
import AdminOrders from "@/pages/dashboard/Admin/Orders";
import AdminUsers from "@/pages/dashboard/Admin/Users";

import ManagerDashboard from "@/pages/dashboard/Manager/Dashboard";
import StaffManagement from "@/pages/dashboard/Manager/StaffManagement";

import StaffDashboard from "@/pages/dashboard/Staff/Dashboard";
import StaffOrders from "@/pages/dashboard/Staff/Orders";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ROUTES } from "@/constants/routes";

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.MOVIES} element={<Movies />} />
      <Route path={ROUTES.MOVIE_DETAIL(":id")} element={<MovieDetails />} />
      <Route path={ROUTES.BOOKS} element={<Books />} />
      <Route path={ROUTES.BOOK_DETAIL(":id")} element={<BookDetails />} />
      <Route path={ROUTES.MANGA} element={<Manga />} />
      <Route path={ROUTES.MANGA_DETAIL(":id")} element={<MangaDetails />} />
      <Route path={ROUTES.COMICS} element={<Comics />} />
      <Route path={ROUTES.COMIC_DETAIL(":id")} element={<ComicDetails />} />
      <Route path={ROUTES.CART} element={<Cart />} />
      <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
      <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path="/search" element={<Search />} />

      <Route path={ROUTES.DASHBOARD_ADMIN} element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.DASHBOARD_ADMIN_PRODUCTS} element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
      <Route path={ROUTES.DASHBOARD_ADMIN_ORDERS} element={<ProtectedRoute roles={['admin', 'manager']}><AdminOrders /></ProtectedRoute>} />
      <Route path={ROUTES.DASHBOARD_ADMIN_USERS} element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />

      <Route path={ROUTES.DASHBOARD_MANAGER} element={<ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.DASHBOARD_MANAGER_STAFF} element={<ProtectedRoute roles={['manager']}><StaffManagement /></ProtectedRoute>} />

      <Route path={ROUTES.DASHBOARD_STAFF} element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />
      <Route path={ROUTES.DASHBOARD_STAFF_ORDERS} element={<ProtectedRoute roles={['staff']}><StaffOrders /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
