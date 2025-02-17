import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePayment } from "@/contexts/PaymentContext";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentMethodSelectorProps {
  amount: number;
  onSuccess: () => void;
}

export function PaymentMethodSelector({
  amount,
  onSuccess,
}: PaymentMethodSelectorProps) {
  const [method, setMethod] = useState<"stripe" | "paypal">("stripe");
  const { processPayment, isProcessing } = usePayment();

  const handleStripePayment = async () => {
    try {
      await processPayment(amount, "stripe");
      onSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <RadioGroup
        value={method}
        onValueChange={(value: "stripe" | "paypal") => setMethod(value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="stripe" id="stripe" />
          <Label htmlFor="stripe" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Credit Card
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            PayPal
          </Label>
        </div>
      </RadioGroup>

      {method === "stripe" ? (
        <Button
          className="w-full"
          onClick={handleStripePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay with Card"}
        </Button>
      ) : (
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              await actions.order.capture();
              onSuccess();
            }
          }}
        />
      )}
    </div>
  );
}
