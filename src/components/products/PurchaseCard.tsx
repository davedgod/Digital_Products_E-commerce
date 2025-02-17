import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck, Info, ShoppingCart } from "lucide-react";

interface PurchaseCardProps {
  price?: number;
  onPurchase?: () => void;
  isLoading?: boolean;
}

const PurchaseCard = ({
  price = 49.99,
  onPurchase = () => {},
  isLoading = false,
}: PurchaseCardProps) => {
  return (
    <Card className="w-[380px] p-6 bg-white shadow-lg sticky top-6">
      <div className="space-y-6">
        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          <Badge variant="secondary" className="text-sm">
            One-time payment
          </Badge>
        </div>

        {/* License Options */}
        <div className="space-y-4">
          <RadioGroup defaultValue="personal">
            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="personal" id="personal" />
              <Label htmlFor="personal" className="flex-1 cursor-pointer">
                <div className="font-medium">Personal License</div>
                <div className="text-sm text-muted-foreground">
                  For individual use
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-3">
              <RadioGroupItem value="commercial" id="commercial" />
              <Label htmlFor="commercial" className="flex-1 cursor-pointer">
                <div className="font-medium">Commercial License</div>
                <div className="text-sm text-muted-foreground">
                  For business use
                </div>
              </Label>
              <Badge>+$99</Badge>
            </div>
          </RadioGroup>
        </div>

        {/* Purchase Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={onPurchase}
          disabled={isLoading}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase Now
        </Button>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-4 py-4 border-y">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Payment
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your payment is processed securely via Stripe</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Money Back Guarantee */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            30-day money-back guarantee. No questions asked if you're not
            satisfied.
          </p>
        </div>

        {/* Features List */}
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            ✓ Instant digital delivery
          </li>
          <li className="flex items-center gap-2">✓ Lifetime access</li>
          <li className="flex items-center gap-2">✓ Free updates</li>
          <li className="flex items-center gap-2">✓ Premium support</li>
        </ul>
      </div>
    </Card>
  );
};

export default PurchaseCard;
