import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, StarHalf } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
  moderation_note?: string;
  user_id: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [pendingReview, setPendingReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select(`*, profiles(full_name, avatar_url)`)
        .eq("product_id", productId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (data) setReviews(data);

      // Check for pending review
      if (user) {
        const { data: pendingData } = await supabase
          .from("reviews")
          .select()
          .eq("product_id", productId)
          .eq("user_id", user.id)
          .eq("status", "pending")
          .maybeSingle();

        setPendingReview(pendingData);
      }
    };

    const checkCanReview = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_items!inner(product_id)
        `,
        )
        .eq("user_id", user.id)
        .eq("status", "completed")
        .eq("order_items.product_id", productId)
        .maybeSingle();

      setCanReview(!!data);
    };

    fetchReviews();
    checkCanReview();

    // Subscribe to new reviews
    const subscription = supabase
      .channel("reviews")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
          filter: `product_id=eq.${productId}`,
        },
        fetchReviews,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [productId, user]);

  const handleSubmitReview = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: newRating,
        comment: newComment,
        status: "pending",
      });

      setNewComment("");
      setNewRating(5);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-primary text-primary"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-primary text-primary" />,
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />,
      );
    }

    return stars;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <div className="flex">
            {renderStars(
              reviews.reduce((acc, rev) => acc + rev.rating, 0) /
                reviews.length || 0,
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {pendingReview && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Your review is pending moderation. We'll notify you once it's
              approved.
              {pendingReview.moderation_note && (
                <span className="block mt-2 text-sm italic">
                  Note: {pendingReview.moderation_note}
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {user && canReview && !pendingReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              Share your thoughts about this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewRating(rating)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${rating <= newRating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Write your review here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.profiles?.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {review.profiles?.full_name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-muted-foreground">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
