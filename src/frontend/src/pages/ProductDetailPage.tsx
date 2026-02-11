import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { useAuthGate } from '../hooks/useAuthGate';
import { useCartStore } from '../state/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import QuantitySelector from '../components/products/QuantitySelector';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(productId);
  const { requireCustomerAuth } = useAuthGate();
  const addToCart = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    requireCustomerAuth(() => {
      addToCart(
        {
          productId: product.id,
          productName: product.name,
          price: product.netRate,
        },
        quantity
      );
      toast.success(`${product.name} (×${quantity}) added to cart`);
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">Product not found</p>
        <Button onClick={() => navigate({ to: '/products' })}>Back to Products</Button>
      </div>
    );
  }

  const imageUrl = product.photo?.getDirectURL();
  const netRateDisplay = Number(product.netRate).toLocaleString();
  const mrpDisplay = Number(product.mrp).toLocaleString();

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" onClick={() => navigate({ to: '/products' })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">{product.category.name}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.description}</p>
          </div>

          <Separator />

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Net Rate</p>
                  <p className="text-4xl font-bold text-primary">NPR {netRateDisplay}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">MRP</p>
                  <p className="text-2xl font-semibold">NPR {mrpDisplay}</p>
                </div>

                {product.bonusOffer && (
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Special Offer</p>
                    <p className="text-lg">🎁 {product.bonusOffer}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">Quantity:</span>
                  <QuantitySelector quantity={quantity} onChange={setQuantity} />
                </div>

                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">Product Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="font-medium">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
