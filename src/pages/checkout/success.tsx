import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { sendOrderConfirmationEmail } from "@/lib/email";

export default function CheckoutSuccessPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Send order confirmation email
    const searchParams = new URLSearchParams(window.location.search);
    const orderId = searchParams.get("order_id");
    if (orderId) {
      sendOrderConfirmationEmail(orderId);
    }
  }, [user, navigate]);

  return (
    <div className="container max-w-md py-24">
      <Card>
        <CardContent className="flex flex-col items-center pt-6 pb-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your digital products are now available
            for download.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/orders")} size="lg">
              View Orders
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} size="lg">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
