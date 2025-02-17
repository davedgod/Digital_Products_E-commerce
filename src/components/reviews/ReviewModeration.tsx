import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { sendReviewStatusEmail } from "@/lib/review-emails";
import { toast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
  moderation_note?: string;
  user_id: string;
  product_id: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
  products?: {
    name: string;
  };
}

export function ReviewModeration() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select(
          `
          *,
          profiles(full_name, avatar_url),
          products(name)
        `,
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (data) setReviews(data);
    };

    fetchReviews();

    const subscription = supabase
      .channel("reviews")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        fetchReviews,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleModerate = async (
    reviewId: string,
    status: string,
    note: string,
  ) => {
    setIsLoading(true);
    try {
      const { data: updatedReview } = await supabase
        .from("reviews")
        .update({
          status,
          moderation_note: note,
          moderated_at: new Date().toISOString(),
          moderated_by: user?.id,
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (updatedReview) {
        await sendReviewStatusEmail(updatedReview.id);
      }

      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error("Error moderating review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Moderation</h2>
        <p className="text-muted-foreground">
          {reviews.length} pending reviews
        </p>
      </div>

      {reviews.map((review) => (
        <Card key={review.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {review.profiles?.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">
                    {review.profiles?.full_name || "Anonymous"}
                  </CardTitle>
                  <CardDescription>for {review.products?.name}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{review.comment}</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <Textarea
                  placeholder="Moderation note (optional)"
                  className="mb-4"
                  id={`note-${review.id}`}
                />
              </div>
              <div className="space-x-2">
                <Button
                  variant="destructive"
                  disabled={isLoading}
                  onClick={() => {
                    const note = (
                      document.getElementById(
                        `note-${review.id}`,
                      ) as HTMLTextAreaElement
                    ).value;
                    handleModerate(review.id, "rejected", note);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="default"
                  disabled={isLoading}
                  onClick={() => {
                    const note = (
                      document.getElementById(
                        `note-${review.id}`,
                      ) as HTMLTextAreaElement
                    ).value;
                    handleModerate(review.id, "approved", note);
                  }}
                >
                  Approve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {reviews.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No pending reviews to moderate
          </CardContent>
        </Card>
      )}
    </div>
  );
}
