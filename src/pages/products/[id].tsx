import React from "react";
import ProductHero from "@/components/products/ProductHero";
import ProductDetails from "@/components/products/ProductDetails";
import PurchaseCard from "@/components/products/PurchaseCard";
import RelatedProducts from "@/components/products/RelatedProducts";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ProductHero />

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            <ProductDetails />
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-auto">
            <PurchaseCard />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={id} />
    </div>
  );
}
