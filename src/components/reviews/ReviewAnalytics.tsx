import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, TrendingUp, Clock, ThumbsUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  approvalRate: number;
}

export function ReviewAnalytics() {
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    pendingReviews: 0,
    approvalRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Get total reviews and average rating
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("rating, status");

      if (reviewData) {
        const total = reviewData.length;
        const approved = reviewData.filter(
          (r) => r.status === "approved",
        ).length;
        const pending = reviewData.filter((r) => r.status === "pending").length;
        const avgRating =
          reviewData.reduce((acc, r) => acc + r.rating, 0) / total || 0;

        setStats({
          totalReviews: total,
          averageRating: avgRating,
          pendingReviews: pending,
          approvalRate: (approved / (total - pending)) * 100 || 0,
        });
      }
    };

    fetchStats();

    const subscription = supabase
      .channel("reviews")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        fetchStats,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <p className="text-xs text-muted-foreground">Across all products</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageRating.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">Out of 5 stars</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          <p className="text-xs text-muted-foreground">Awaiting moderation</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.approvalRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Of moderated reviews</p>
        </CardContent>
      </Card>
    </div>
  );
}
