import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/common/Hero/Hero";
import { Categories } from "@/components/Categories";
import { TrendingMovies } from "@/components/Movies";

function Home() {
  return (
    <MainLayout>
      <Hero />
      <Categories />
      <TrendingMovies />
    </MainLayout>
  );
}

export default Home;