import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import FeaturedProductsSlider from "./FeaturedProductsSlider";

interface MainHeroProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
}

const MainHero = ({
  title = "Discover Digital Products",
  subtitle = "Find the perfect digital assets for your next project",
  searchPlaceholder = "Search for digital products...",
}: MainHeroProps) => {
  return (
    <div className="w-full min-h-[600px] bg-gradient-to-b from-primary/5 to-background px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Text Content */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                className="pl-10 h-12"
              />
            </div>
            <Button size="lg" className="h-12 px-8">
              Search
            </Button>
          </div>
        </div>

        {/* Featured Products Slider */}
        <div className="mt-12">
          <FeaturedProductsSlider />
        </div>
      </div>
    </div>
  );
};

export default MainHero;
