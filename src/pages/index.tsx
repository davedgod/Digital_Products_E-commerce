import React from "react";
import MainHero from "@/components/home/MainHero";
import ProductCategoriesGrid from "@/components/home/ProductCategoriesGrid";
import RealtimeTopSellers from "@/components/home/RealtimeTopSellers";
import FeaturedProductsSlider from "@/components/home/FeaturedProductsSlider";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Featured Products */}
      <MainHero />

      {/* Featured Products Slider */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <FeaturedProductsSlider />
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
          <ProductCategoriesGrid />
        </div>
      </section>

      {/* Top Sellers Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trending Now</h2>
          <RealtimeTopSellers />
        </div>
      </section>
    </div>
  );
};

export default HomePage;