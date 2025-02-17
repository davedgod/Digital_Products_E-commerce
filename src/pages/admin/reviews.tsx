import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReviewModeration } from "@/components/reviews/ReviewModeration";
import { ReviewAnalytics } from "@/components/reviews/ReviewAnalytics";
import { supabase } from "@/lib/supabase";

export default function AdminReviewsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate("/");
        return;
      }

      const {
        data: { user: userData },
      } = await supabase.auth.getUser();
      if (!userData?.user_metadata?.role === "admin") {
        navigate("/");
      }
    };

    checkAdmin();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container max-w-4xl py-12">
      <ReviewAnalytics />
      <div className="mt-8">
        <ReviewModeration />
      </div>
    </div>
  );
}
