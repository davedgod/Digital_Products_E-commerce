import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCategory } from "@/contexts/CategoryContext";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export default function CategoryGrid() {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Templates",
      description: "Professional website templates",
      image_url:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&h=200&fit=crop",
    },
    {
      id: "2",
      name: "Graphics",
      description: "High-quality design assets",
      image_url:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=200&fit=crop",
    },
    {
      id: "3",
      name: "Fonts",
      description: "Beautiful typography",
      image_url:
        "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=300&h=200&fit=crop",
    },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      if (data?.length) setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Browse Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                selectedCategory === category.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id,
                )
              }
            >
              <CardContent className="p-0">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
