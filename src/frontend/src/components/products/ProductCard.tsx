import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import QuantitySelector from './QuantitySelector';
import type { Product } from '../../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const imageUrl = product.photo?.getDirectURL();
  const netRateDisplay = Number(product.netRate).toLocaleString();
  const mrpDisplay = Number(product.mrp).toLocaleString();

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to="/products/$productId" params={{ productId: product.id }}>
        <div className="aspect-square bg-muted relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to="/products/$productId" params={{ productId: product.id }}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{product.category.name}</Badge>
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">NPR {netRateDisplay}</span>
              <span className="text-xs text-muted-foreground ml-1">Net Rate</span>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-sm text-muted-foreground">MRP: NPR {mrpDisplay}</span>
          </div>
        </div>
        {product.bonusOffer && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs">
              🎁 {product.bonusOffer}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">Quantity:</span>
          <QuantitySelector quantity={quantity} onChange={setQuantity} />
        </div>
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
