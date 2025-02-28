import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface FeaturedProductsSliderProps {
  products?: Product[];
  autoPlay?: boolean;
  interval?: number;
}

const defaultProducts: Product[] = [
  {
    id: "1",
    title: "Digital Marketing Course",
    price: 99.99,
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=300&fit=crop",
    category: "Education",
  },
  {
    id: "2",
    title: "Premium UI Kit",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
    category: "Design",
  },
  {
    id: "3",
    title: "Photography Masterclass",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=300&fit=crop",
    category: "Photography",
  },
  {
    id: "4",
    title: "Web Development Course",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Development"
  },
  {
    id: "5",
    title: "Business Strategy Bundle",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    category: "Business"
  }
];

const FeaturedProductsSlider = ({
  products = defaultProducts,
  autoPlay = true,
  interval = 5000,
}: FeaturedProductsSliderProps) => {
  return (
    <div className="w-full bg-white p-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-full">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary"
                    >
                      {product.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">
                    {product.title}
                  </CardTitle>
                  <p className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </div>
  );
};

export default FeaturedProductsSlider;
