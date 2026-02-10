import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/products/ProductCard';
import { useAuthGate } from '../hooks/useAuthGate';
import { useCartStore } from '../state/cartStore';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ProfileSetupDialog from '../components/auth/ProfileSetupDialog';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../backend';

export default function HomePage() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const { requireCustomerAuth } = useAuthGate();
  const addToCart = useCartStore((state) => state.addItem);
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Show first 4 products as "hot products"
  const hotProducts = products.slice(0, 4);

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
          price: product.price,
        },
        quantity
      );
      toast.success(`${product.name} (×${quantity}) added to cart`);
    });
  };

  return (
    <>
      <div>
        {/* Hero Section */}
        <section className="medical-gradient py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Professional Wholesale Pharmaceutical Supplier
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Hi-Tech Pharmaceuticals Pvt. Ltd. - Your trusted partner for quality medicines and
              ethical wholesale trade
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Hot Products Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Hot Products</h2>
                <p className="text-muted-foreground">
                  Check out our featured pharmaceutical products
                </p>
              </div>
              <Link to="/products">
                <Button variant="outline" className="hidden sm:flex">
                  View All Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>
            ) : hotProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products available yet</p>
                <Link to="/products">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hotProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
                <div className="text-center mt-8 sm:hidden">
                  <Link to="/products">
                    <Button variant="outline">
                      View All Products
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Ordering?</h2>
            <p className="text-lg mb-8 opacity-90">
              Browse our complete product catalog and place your wholesale orders today
            </p>
            <Link to="/products">
              <Button size="lg" variant="secondary">
                View All Products
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <ProfileSetupDialog open={showProfileSetup} />
    </>
  );
}
