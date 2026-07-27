import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ROUTES } from "@/constants/routes";

const Home = lazy(() => import("@/pages/Home/Home"));
const Login = lazy(() => import("@/pages/Login/Login"));
const Register = lazy(() => import("@/pages/Register/Register"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));
const Cart = lazy(() => import("@/pages/Cart/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout/Checkout"));
const Wishlist = lazy(() => import("@/pages/Wishlist/Wishlist"));
const Profile = lazy(() => import("@/pages/Profile/Profile"));
const OrderDetail = lazy(() => import("@/pages/Orders/OrderDetail"));
const Search = lazy(() => import("@/pages/Search/Search"));
const BecomeSeller = lazy(() => import("@/pages/BecomeSeller/BecomeSeller"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword/ResetPassword"));
const UpdatePassword = lazy(() => import("@/pages/UpdatePassword/UpdatePassword"));
const AuthCallback = lazy(() => import("@/pages/Auth/Callback"));

const Movies = lazy(() => import("@/pages/Movies/Movies"));
const MovieDetails = lazy(() => import("@/pages/Movies/MovieDetails"));

const Books = lazy(() => import("@/pages/Books/Books"));
const BookDetails = lazy(() => import("@/pages/Books/BookDetails"));

const Manga = lazy(() => import("@/pages/Manga/Manga"));
const MangaDetails = lazy(() => import("@/pages/Manga/MangaDetails"));

const Comics = lazy(() => import("@/pages/Comics/Comics"));
const ComicDetails = lazy(() => import("@/pages/Comics/ComicDetails"));

const AdminDashboard = lazy(() => import("@/pages/dashboard/Admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/dashboard/Admin/Products"));
const AdminOrders = lazy(() => import("@/pages/dashboard/Admin/Orders"));
const AdminUsers = lazy(() => import("@/pages/dashboard/Admin/Users"));
const AdminCoupons = lazy(() => import("@/pages/dashboard/Admin/Coupons"));

const ManagerDashboard = lazy(() => import("@/pages/dashboard/Manager/Dashboard"));
const StaffManagement = lazy(() => import("@/pages/dashboard/Manager/StaffManagement"));

const StaffDashboard = lazy(() => import("@/pages/dashboard/Staff/Dashboard"));
const StaffOrders = lazy(() => import("@/pages/dashboard/Staff/Orders"));

function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 gap-4">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-r-fuchsia-500" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
    </div>
  )
}

function PageBoundary({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<PageBoundary><Home /></PageBoundary>} />
        <Route path={ROUTES.MOVIES} element={<PageBoundary><Movies /></PageBoundary>} />
        <Route path={ROUTES.MOVIE_DETAIL(":id")} element={<PageBoundary><MovieDetails /></PageBoundary>} />
        <Route path={ROUTES.BOOKS} element={<PageBoundary><Books /></PageBoundary>} />
        <Route path={ROUTES.BOOK_DETAIL(":id")} element={<PageBoundary><BookDetails /></PageBoundary>} />
        <Route path={ROUTES.MANGA} element={<PageBoundary><Manga /></PageBoundary>} />
        <Route path={ROUTES.MANGA_DETAIL(":id")} element={<PageBoundary><MangaDetails /></PageBoundary>} />
        <Route path={ROUTES.COMICS} element={<PageBoundary><Comics /></PageBoundary>} />
        <Route path={ROUTES.COMIC_DETAIL(":id")} element={<PageBoundary><ComicDetails /></PageBoundary>} />
        <Route path={ROUTES.CART} element={<ProtectedRoute redirectTo={ROUTES.REGISTER}><PageBoundary><Cart /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.CHECKOUT} element={<ProtectedRoute redirectTo={ROUTES.REGISTER}><PageBoundary><Checkout /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.WISHLIST} element={<ProtectedRoute redirectTo={ROUTES.REGISTER}><PageBoundary><Wishlist /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.PROFILE} element={<ProtectedRoute redirectTo={ROUTES.REGISTER}><PageBoundary><Profile /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.ORDER_DETAIL(":id")} element={<ProtectedRoute redirectTo={ROUTES.REGISTER}><PageBoundary><OrderDetail /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.LOGIN} element={<PageBoundary><Login /></PageBoundary>} />
        <Route path={ROUTES.REGISTER} element={<PageBoundary><Register /></PageBoundary>} />
        <Route path={ROUTES.RESET_PASSWORD} element={<PageBoundary><ResetPassword /></PageBoundary>} />
        <Route path={ROUTES.UPDATE_PASSWORD} element={<PageBoundary><UpdatePassword /></PageBoundary>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/search" element={<PageBoundary><Search /></PageBoundary>} />
        <Route path={ROUTES.BECOME_SELLER} element={<PageBoundary><BecomeSeller /></PageBoundary>} />

        <Route path={ROUTES.DASHBOARD_ADMIN} element={<ProtectedRoute roles={['admin']}><PageBoundary><AdminDashboard /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.DASHBOARD_ADMIN_PRODUCTS} element={<ProtectedRoute roles={['admin']}><PageBoundary><AdminProducts /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.DASHBOARD_ADMIN_COUPONS} element={<ProtectedRoute roles={['admin']}><PageBoundary><AdminCoupons /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.DASHBOARD_ADMIN_ORDERS} element={<ProtectedRoute roles={['admin', 'manager']}><PageBoundary><AdminOrders /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.DASHBOARD_ADMIN_USERS} element={<ProtectedRoute roles={['admin']}><PageBoundary><AdminUsers /></PageBoundary></ProtectedRoute>} />

        <Route path={ROUTES.DASHBOARD_MANAGER} element={<ProtectedRoute roles={['manager']}><PageBoundary><ManagerDashboard /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.DASHBOARD_MANAGER_STAFF} element={<ProtectedRoute roles={['manager']}><PageBoundary><StaffManagement /></PageBoundary></ProtectedRoute>} />

        <Route path={ROUTES.DASHBOARD_STAFF} element={<ProtectedRoute roles={['staff']}><PageBoundary><StaffDashboard /></PageBoundary></ProtectedRoute>} />
        <Route path={ROUTES.DASHBOARD_STAFF_ORDERS} element={<ProtectedRoute roles={['staff']}><PageBoundary><StaffOrders /></PageBoundary></ProtectedRoute>} />

        <Route path="*" element={<PageBoundary><NotFound /></PageBoundary>} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
