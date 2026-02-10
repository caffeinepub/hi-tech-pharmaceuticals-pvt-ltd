import { Link } from '@tanstack/react-router';
import { useGetAllOrders } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingBag, Eye } from 'lucide-react';

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();

  const sortedOrders = [...orders].sort((a, b) => b.id.localeCompare(a.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and inquiries</p>
      </div>

      {sortedOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 12)}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>{order.status}</Badge>
                    <Link to="/admin/orders/$orderId" params={{ orderId: order.id }}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-mono text-xs">{order.customer.toString().slice(0, 20)}...</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items</p>
                    <p className="font-medium">{order.items.length} products</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Quantity</p>
                    <p className="font-medium">
                      {order.items.reduce((sum, item) => sum + Number(item.quantity), 0)} units
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
