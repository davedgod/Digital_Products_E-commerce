import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CartItem {
  id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    image_url: string;
  };
}

export default function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "1",
      products: {
        name: "Premium Template",
        price: 49.99,
        image_url:
          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300&h=200&fit=crop",
      },
      quantity: 1,
    },
  ]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const { data } = await supabase.from("cart_items").select(`
          id,
          quantity,
          products (name, price, image_url)
        `);
      if (data?.length) setItems(data);
    };
    fetchCartItems();

    const subscription = supabase
      .channel("cart_items")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cart_items" },
        fetchCartItems,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0,
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[11px] font-medium text-primary-foreground flex items-center justify-center">
            {items.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Shopping Cart</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 mb-3">
                <img
                  src={item.products.image_url}
                  alt={item.products.name}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.products.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.products.price} x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full">Checkout</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
