import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  id: string;
  quantity: number;
  price_at_time: number;
  download_url: string;
  products: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: "pending" | "completed" | "failed";
  order_items: OrderItem[];
  confirmation_email_sent: boolean;
  status_email_sent: boolean;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*, products (name, image_url))
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data);
    };

    fetchOrders();
  }, [user, navigate]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container max-w-6xl py-12">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <CardDescription>
                    {new Date(order.created_at).toLocaleDateString()}
                    {order.confirmation_email_sent && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Confirmation sent)
                      </span>
                    )}
                    {order.status_email_sent && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        (Status update sent)
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge
                  className={`${getStatusColor(
                    order.status,
                  )} text-white capitalize`}
                >
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                          <span className="font-medium">
                            {item.products.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price_at_time.toFixed(2)}</TableCell>
                      <TableCell>
                        {order.status === "completed" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-2"
                          >
                            <a
                              href={item.download_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        ) : (
                          <Badge variant="secondary">Unavailable</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <p className="text-lg font-bold">
                  Total: ${order.total_amount.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-muted-foreground">
                Your purchased items will appear here
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/")}
                variant="outline"
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
