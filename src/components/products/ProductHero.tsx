import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Heart, Share2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductHeroProps {
  title?: string;
  price?: number;
  rating?: number;
  sales?: number;
  images?: string[];
  category?: string;
}

const ProductHero = ({
  title = "Premium Digital Template Bundle",
  price = 49.99,
  rating = 4.8,
  sales = 1234,
  images = [
    "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&auto=format&fit=crop&q=60",
  ],
  category = "Templates",
}: ProductHeroProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="w-full min-h-[600px] bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <AspectRatio ratio={16 / 9}>
              <motion.img
                key={selectedImage}
                src={images[selectedImage]}
                alt={`Product image ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </AspectRatio>
          </Card>

          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative rounded-lg overflow-hidden ${selectedImage === index ? "ring-2 ring-primary" : ""}`}
              >
                <AspectRatio ratio={1}>
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{category}</Badge>
            <h1 className="text-4xl font-bold">{title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{rating}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{sales} sales</span>
          </div>

          <div className="text-3xl font-bold text-primary">
            ${price.toFixed(2)}
          </div>

          <div className="flex space-x-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="license">License</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <p className="text-muted-foreground">
                A comprehensive digital template bundle perfect for modern
                design needs. Includes multiple formats and styles for various
                use cases.
              </p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>High-resolution files</li>
                <li>Fully customizable layers</li>
                <li>Commercial license included</li>
                <li>Free lifetime updates</li>
              </ul>
            </TabsContent>
            <TabsContent value="license" className="mt-4">
              <p className="text-muted-foreground">
                Standard license for both personal and commercial use. Unlimited
                projects and clients. Redistribution not permitted.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
