import Seo from "@/components/Seo";
import MainLayout from "@/components/layout/MainLayout";
import Hero from "@/components/Hero/Hero";
import { Categories } from "@/components/Categories";
import { TrendingMovies } from "@/components/Movies";
import { TrendingBooks } from "@/components/Books";
import { TrendingManga } from "@/components/Manga";
import { TrendingComics } from "@/components/Comics";
import LocalMoviesSection from "@/components/Movies/LocalMoviesSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionDivider from "@/components/ui/SectionDivider";
import Recommendations from "@/components/AI/Recommendations";

function Home() {
  return (
    <MainLayout>
      <Seo title="Home" description="Discover and shop movies, books, manga, and comics — your ultimate entertainment marketplace." />
      <Hero />
      <SectionDivider />
      <ScrollReveal>
        <Categories />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal>
        <Recommendations />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal>
        <TrendingMovies />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal delay={0.1}>
        <LocalMoviesSection />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal delay={0.1}>
        <TrendingBooks />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal delay={0.2}>
        <TrendingManga />
      </ScrollReveal>
      <SectionDivider />
      <ScrollReveal delay={0.3}>
        <TrendingComics />
      </ScrollReveal>
      <SectionDivider />
    </MainLayout>
  );
}

export default Home;