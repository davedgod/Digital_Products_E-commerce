import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  sales: number;
  image: string;
  category: string;
}

interface RealtimeTopSellersProps {
  products?: Product[];
}

const defaultProducts: Product[] = [
  {
    id: "1",
    title: "Advanced Web Development Course",
    price: 129.99,
    sales: 1234,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    category: "Development",
  },
  {
    id: "2",
    title: "Digital Art Masterclass",
    price: 89.99,
    sales: 956,
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    category: "Design",
  },
  {
    id: "3",
    title: "Business Strategy Bundle",
    price: 199.99,
    sales: 789,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: "Business",
  },
];

const RealtimeTopSellers = ({
  products = defaultProducts,
}: RealtimeTopSellersProps) => {
  const [topProducts, setTopProducts] = useState(products);

  useEffect(() => {
    // Simulated real-time updates
    const interval = setInterval(() => {
      setTopProducts((prev) =>
        prev.map((product) => ({
          ...product,
          sales: product.sales + Math.floor(Math.random() * 10),
        })),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Top Sellers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2" variant="secondary">
                  {product.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      {product.sales.toLocaleString()} sales
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealtimeTopSellers;
