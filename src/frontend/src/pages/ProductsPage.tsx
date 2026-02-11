import { useState, useMemo } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import { useAuthGate } from '../hooks/useAuthGate';
import { useCartStore } from '../state/cartStore';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProductCard from '../components/products/ProductCard';
import AZFilter from '../components/products/AZFilter';
import ProfileSetupDialog from '../components/auth/ProfileSetupDialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../backend';

export default function ProductsPage() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { data: products = [], isLoading } = useGetAllProducts();
  const { requireCustomerAuth } = useAuthGate();
  const addToCart = useCartStore((state) => state.addItem);
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedLetter) {
      filtered = filtered.filter((p) => p.name.toUpperCase().startsWith(selectedLetter));
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [products, selectedLetter]);

  const handleAddToCart = (product: Product, quantity: number) => {
    requireCustomerAuth(() => {
      if (showProfileSetup) {
        toast.error('Please complete your profile first');
        return;
      }
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
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            Browse our complete catalog of pharmaceutical products
          </p>
        </div>

        <div className="mb-8">
          <AZFilter selectedLetter={selectedLetter} onSelectLetter={setSelectedLetter} />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {selectedLetter
                ? `No products found starting with "${selectedLetter}"`
                : 'No products available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>

      <ProfileSetupDialog open={showProfileSetup} />
    </>
  );
}
