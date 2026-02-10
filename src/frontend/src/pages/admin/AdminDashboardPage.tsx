import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FolderTree, ShoppingBag } from 'lucide-react';
import { useGetAllProducts, useGetAllCategories, useGetAllOrders } from '../../hooks/useQueries';

export default function AdminDashboardPage() {
  const { data: products = [] } = useGetAllProducts();
  const { data: categories = [] } = useGetAllCategories();
  const { data: orders = [] } = useGetAllOrders();

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      link: '/admin/products',
      description: 'Manage product catalog',
    },
    {
      title: 'Categories',
      value: categories.length,
      icon: FolderTree,
      link: '/admin/categories',
      description: 'Organize products',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: ShoppingBag,
      link: '/admin/orders',
      description: 'Review customer orders',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your pharmaceutical wholesale platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>{stat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
