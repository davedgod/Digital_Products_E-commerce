import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

interface RelatedProductsProps {
  products?: Product[];
  currentProductId?: string;
}

export default function RelatedProducts({
  products = [
    {
      id: "1",
      name: "Digital Marketing Template Pack",
      price: 49.99,
      image_url:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=350&fit=crop",
      category: "Templates",
    },
    {
      id: "2",
      name: "Social Media Strategy Guide",
      price: 29.99,
      image_url:
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=500&h=350&fit=crop",
      category: "Guides",
    },
    {
      id: "3",
      name: "Business Analytics Dashboard",
      price: 79.99,
      image_url:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=350&fit=crop",
      category: "Templates",
    },
    {
      id: "4",
      name: "Content Creation Toolkit",
      price: 39.99,
      image_url:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=350&fit=crop",
      category: "Tools",
    },
  ],
  currentProductId = "1",
}: RelatedProductsProps) {
  // Filter out the current product
  const filteredProducts = products.filter(
    (product) => product.id !== currentProductId,
  );

  return (
    <div className="w-full bg-background py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link to={`/products/${product.id}`} key={product.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    {product.category}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-primary font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
