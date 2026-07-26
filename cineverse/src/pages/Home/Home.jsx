import Seo from "@/components/Seo";
import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/Hero/Hero";
import { Categories } from "@/components/Categories";
import { TrendingMovies } from "@/components/Movies";

function Home() {
  return (
    <MainLayout>
      <Seo title="Home" description="Discover and shop movies, books, manga, and comics — your ultimate entertainment marketplace." />
      <Hero />
      <Categories />
      <TrendingMovies />
    </MainLayout>
  );
}

export default Home;