import { supabase } from "./supabase";

export const sendOrderConfirmationEmail = async (orderId: string) => {
  try {
    const { data: order } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*, products (name, price))
      `,
      )
      .eq("id", orderId)
      .single();

    if (!order) throw new Error("Order not found");

    const { data: userData } = await supabase.auth.admin.getUserById(
      order.user_id,
    );
    if (!userData?.user) throw new Error("User not found");

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: userData.user.email,
          orderId: order.id,
          items: order.order_items,
          total: order.total_amount,
        }),
      },
    );

    if (!response.ok) throw new Error("Failed to send email");

    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
};

export const sendOrderStatusEmail = async (orderId: string, status: string) => {
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("*, user:user_id(email)")
      .eq("id", orderId)
      .single();

    if (!order) throw new Error("Order not found");

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-status-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          to: order.user.email,
          orderId: order.id,
          status,
        }),
      },
    );

    if (!response.ok) throw new Error("Failed to send email");

    return true;
  } catch (error) {
    console.error("Error sending order status email:", error);
    return false;
  }
};
