import React from "react";
import { useFormatPrice } from "@/utils/currency";

function ProductPrice({ price }: { price: number }) {
  const formatPrice = useFormatPrice();
  return <span className="text-lg font-semibold text-primary">{formatPrice(price)}</span>;
}

export default ProductPrice;