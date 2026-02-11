import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllOrders, useUpdateOrderStatus, useGetOrderCustomerDetails } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminOrderDetailPage() {
  const { orderId } = useParams({ from: '/admin/orders/$orderId' });
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useGetAllOrders();
  const { data: customerDetails, isLoading: customerLoading } = useGetOrderCustomerDetails(orderId);
  const updateStatus = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState('');

  const order = orders.find((o) => o.id === orderId);

  const handleUpdateStatus = async () => {
    if (!newStatus || !order) return;

    try {
      await updateStatus.mutateAsync({ orderId: order.id, status: newStatus });
      toast.success('Order status updated');
      setNewStatus('');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Button onClick={() => navigate({ to: '/admin/orders' })}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={() => navigate({ to: '/admin/orders' })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order #{order.id.slice(0, 12)}</CardTitle>
                <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Details
                </h3>
                {customerLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading customer details...</span>
                  </div>
                ) : customerDetails ? (
                  <div className="space-y-2 bg-muted p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{customerDetails.profile?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{customerDetails.profile?.email || 'Not provided'}</p>
                    </div>
                    {customerDetails.profile?.phoneNumber && (
                      <div>
                        <p className="text-xs text-muted-foreground">Phone Number</p>
                        <p className="font-medium">{customerDetails.profile.phoneNumber}</p>
                      </div>
                    )}
                    {customerDetails.profile?.panNumber && (
                      <div>
                        <p className="text-xs text-muted-foreground">PAN Number</p>
                        <p className="font-medium">{customerDetails.profile.panNumber}</p>
                      </div>
                    )}
                    {customerDetails.profile?.address && (
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-medium">{customerDetails.profile.address}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Customer Principal</p>
                      <p className="font-mono text-xs break-all">{customerDetails.principal.toString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-muted p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">Not provided</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">Not provided</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Customer Principal</p>
                      <p className="font-mono text-xs break-all">{order.customer.toString()}</p>
                    </div>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">Product ID: {item.productId}</p>
                      </div>
                      <p className="font-semibold">Qty: {Number(item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleUpdateStatus} disabled={!newStatus || updateStatus.isPending}>
                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
