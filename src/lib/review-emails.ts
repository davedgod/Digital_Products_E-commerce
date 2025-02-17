import { supabase } from "./supabase";

export const sendReviewStatusEmail = async (reviewId: string) => {
  try {
    const { data: review } = await supabase
      .from("reviews")
      .select(
        `
        *,
        products (name),
        profiles!reviews_user_id_fkey (email)
      `,
      )
      .eq("id", reviewId)
      .single();

    if (!review) throw new Error("Review not found");

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-review-status-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: review.profiles.email,
          productName: review.products.name,
          status: review.status,
          moderationNote: review.moderation_note,
        }),
      },
    );

    if (!response.ok) throw new Error("Failed to send email");

    return true;
  } catch (error) {
    console.error("Error sending review status email:", error);
    return false;
  }
};
