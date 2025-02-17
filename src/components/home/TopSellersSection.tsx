import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useCategory } from "@/contexts/CategoryContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function TopSellers() {
  const { addToCart, isLoading } = useCart();
  const { selectedCategory } = useCategory();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Premium Website Template",
      price: 49.99,
      image_url:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&h=200&fit=crop",
    },
    {
      id: "2",
      name: "Icon Pack Pro",
      price: 19.99,
      image_url:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=200&fit=crop",
    },
    {
      id: "3",
      name: "Premium Font Family",
      price: 29.99,
      image_url:
        "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=300&h=200&fit=crop",
    },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }

      const { data } = await query.limit(6);
      if (data?.length) setProducts(data);
    };
    fetchProducts();

    const subscription = supabase
      .channel("products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        fetchProducts,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Top Sellers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Button
                      onClick={() => addToCart(product.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
