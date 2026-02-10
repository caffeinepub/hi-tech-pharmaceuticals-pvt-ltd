import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../state/cartStore';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSubmitOrder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProfileSetupDialog from '../components/auth/ProfileSetupDialog';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, getTotalItems } = useCartStore();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const submitOrder = useSubmitOrder();
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/cart' });
    }
  }, [isAuthenticated, navigate]);

  const totalAmount = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (showProfileSetup) {
      toast.error('Please complete your profile first');
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: BigInt(item.quantity),
      }));

      await submitOrder.mutateAsync(orderItems);
      setOrderSubmitted(true);
      clearCart();
      toast.success('Order submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit order');
      console.error(error);
    }
  };

  if (orderSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h1 className="text-3xl font-bold mb-2">Order Submitted Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We will process it shortly and contact you for confirmation.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate({ to: '/products' })}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/orders' })}>
              View Order History
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate({ to: '/cart' });
    return null;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      NPR {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {userProfile && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{userProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium">{getTotalItems()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">NPR {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmitOrder}
                  disabled={submitOrder.isPending || showProfileSetup}
                >
                  {submitOrder.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Order'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this order, you agree to our terms and conditions for wholesale trade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ProfileSetupDialog open={showProfileSetup} />
    </>
  );
}
