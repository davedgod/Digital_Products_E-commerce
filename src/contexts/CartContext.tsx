import { createContext, useContext, useEffect, useState } from "react";
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

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: async () => {},
  isLoading: false,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCartItems = async () => {
    const { data } = await supabase.from("cart_items").select(`
        id,
        quantity,
        products (name, price, image_url)
      `);
    if (data) setItems(data);
  };

  useEffect(() => {
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

  const addToCart = async (productId: string) => {
    setIsLoading(true);
    try {
      // For demo, using a static user_id
      const userId = "00000000-0000-0000-0000-000000000000";

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select()
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

      if (existingItem) {
        // Update quantity
        await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);
      } else {
        // Add new item
        await supabase.from("cart_items").insert({
          user_id: userId,
          product_id: productId,
          quantity: 1,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ items, addToCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
