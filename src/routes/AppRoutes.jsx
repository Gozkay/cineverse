import { Routes, Route } from "react-router-dom";
import MovieDetails from "@/pages/MovieDetails/MovieDetails";

import Home from "@/pages/Home/Home";
import Products from "@/pages/Products/Products";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import NotFound from "@/pages/NotFound/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;