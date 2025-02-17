import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

interface ProductCategoriesGridProps {
  categories?: Category[];
}

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Digital Marketing",
    description: "Courses and tools for online marketing success",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
    productCount: 24,
  },
  {
    id: "2",
    name: "Design Resources",
    description: "UI kits, templates, and design assets",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    productCount: 36,
  },
  {
    id: "3",
    name: "Development",
    description: "Code snippets, plugins, and frameworks",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop",
    productCount: 42,
  },
  {
    id: "4",
    name: "Photography",
    description: "Stock photos, presets, and tutorials",
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500&h=300&fit=crop",
    productCount: 18,
  },
  {
    id: "5",
    name: "Business",
    description: "Templates, planners, and business tools",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=300&fit=crop",
    productCount: 29,
  },
  {
    id: "6",
    name: "Audio",
    description: "Sound effects, music, and audio tools",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=300&fit=crop",
    productCount: 15,
  },
];

const ProductCategoriesGrid = ({
  categories = defaultCategories,
}: ProductCategoriesGridProps) => {
  return (
    <div className="w-full bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden cursor-pointer h-full">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {category.productCount} Products
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategoriesGrid;
