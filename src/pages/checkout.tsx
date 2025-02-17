import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, ShoppingBag } from "lucide-react";
import { stripePromise, createCheckoutSession } from "@/lib/stripe";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "@/components/ui/use-toast";

export default function CheckoutPage() {
  const { items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe not loaded");

      const session = await createCheckoutSession(items);
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process checkout",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container max-w-6xl py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" /> Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4">
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.products.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.products.price.toFixed(2)} x {item.quantity}
                    </p>
                    <p className="font-medium">
                      ${(item.products.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <PaymentMethodSelector
                amount={total}
                onSuccess={() => navigate("/checkout/success")}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
