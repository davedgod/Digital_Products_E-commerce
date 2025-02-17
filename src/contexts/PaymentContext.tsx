import { createContext, useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface PaymentContextType {
  processPayment: (
    amount: number,
    method: "stripe" | "paypal",
  ) => Promise<void>;
  isProcessing: boolean;
}

const PaymentContext = createContext<PaymentContextType>({
  processPayment: async () => {},
  isProcessing: false,
});

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (
    amount: number,
    method: "stripe" | "paypal",
  ) => {
    setIsProcessing(true);
    try {
      if (method === "stripe") {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe not loaded");

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });

        const { clientSecret } = await response.json();
        await stripe.confirmCardPayment(clientSecret);
      } else if (method === "paypal") {
        // PayPal payment logic will be handled by the PayPal buttons component
      }
    } catch (error) {
      console.error("Payment error:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ processPayment, isProcessing }}>
      <PayPalScriptProvider
        options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
      >
        {children}
      </PayPalScriptProvider>
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);
