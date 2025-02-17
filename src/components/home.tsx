import Header from "./Header";
import HeroSection from "./home/HeroSection";
import CategoryGrid from "./home/CategoryGrid";
import TopSellers from "./home/TopSellersSection";
import FloatingCart from "./cart/FloatingCartWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoryGrid />
        <TopSellers />
      </main>
      <FloatingCart />
    </div>
  );
}
