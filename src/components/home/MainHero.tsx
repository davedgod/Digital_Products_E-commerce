import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import FeaturedProductsSlider from "@/components/home/FeaturedProductsSlider";

const MainHero = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const { search } = useSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await search(inputValue.trim());
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="w-full min-h-[400px] bg-gradient-to-b from-primary/5 to-background px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Discover Digital Products
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect digital assets for your next project
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search digital products..."
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8">
              Search
            </Button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default MainHero;