import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, FileText, Star } from "lucide-react";
import ProductPrice from "./ProductPrice";

interface ProductDetailsProps {
  name: string;
  price: number;
  description?: string;
  technicalDetails?: {
    format: string;
    fileSize: string;
    compatibility: string[];
    version: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: string;
  }>;
}

const ProductDetails = ({
  name,
  price,
  description = "This is a comprehensive digital product that helps you achieve amazing results. It includes multiple features and benefits that will enhance your workflow and productivity.",
  technicalDetails = {
    format: "PDF, PSD, AI",
    fileSize: "2.5 GB",
    compatibility: ["Adobe Photoshop 2023", "Adobe Illustrator 2023", "Figma"],
    version: "2.0.0",
  },
  reviews = [
    {
      id: "1",
      rating: 5,
      comment: "Excellent product, exceeded my expectations!",
      author: "John Doe",
      date: "2024-03-15",
    },
    {
      id: "2",
      rating: 4,
      comment: "Very useful, but could use more documentation.",
      author: "Jane Smith",
      date: "2024-03-14",
    },
  ],
}: ProductDetailsProps) => {
  return (
    <Card className="w-full bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      <ProductPrice price={price} />
      <Tabs defaultValue="description" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{description}</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" />
                  <span>Instant Download</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" />
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" />
                  <span>Free Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" />
                  <span>Premium Support</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="technical">
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-500" />
                <span className="font-semibold">File Format:</span>
                <span>{technicalDetails.format}</span>
              </div>
              <div>
                <span className="font-semibold">File Size:</span>
                <span className="ml-2">{technicalDetails.fileSize}</span>
              </div>
              <div>
                <span className="font-semibold">Compatible With:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {technicalDetails.compatibility.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold">Version:</span>
                <span className="ml-2">{technicalDetails.version}</span>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="reviews">
          <ScrollArea className="h-[400px] w-full pr-4">
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${index < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.author}</span>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProductDetails;