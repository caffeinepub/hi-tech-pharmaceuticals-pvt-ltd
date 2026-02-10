import { Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Package, ShoppingBag, FolderTree, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminLogout, useIsAdminSessionActive } from '../../hooks/useQueries';
import { clearAdminSessionUIState } from '../../utils/adminSession';
import AdminRouteGuard from '../admin/AdminRouteGuard';

export default function AdminLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: isSessionActive } = useIsAdminSessionActive();
  const adminLogout = useAdminLogout();
  const routerState = useRouterState();

  // Only render admin layout for admin routes
  const isAdminRoute = routerState.location.pathname.startsWith('/admin');
  const isLoginPage = routerState.location.pathname === '/admin/login';
  
  if (!isAdminRoute) {
    return <Outlet />;
  }

  // Render login page without guard or header
  if (isLoginPage) {
    return <Outlet />;
  }

  const handleLogout = async () => {
    try {
      await adminLogout.mutateAsync();
      clearAdminSessionUIState();
      queryClient.clear();
      navigate({ to: '/admin/login' });
    } catch (error) {
      console.error('Logout error:', error);
      clearAdminSessionUIState();
      queryClient.clear();
      navigate({ to: '/admin/login' });
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <AdminRouteGuard>
      <div className="min-h-screen flex flex-col bg-muted/20">
        {/* Admin Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link to="/admin" className="flex items-center space-x-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold">Admin Panel</span>
                    <span className="text-xs text-muted-foreground">Hi-Tech Pharmaceuticals</span>
                  </div>
                </Link>

                <nav className="hidden md:flex items-center space-x-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md"
                        activeProps={{ className: 'bg-primary/10 text-primary' }}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {isSessionActive && (
                <Button variant="outline" size="sm" onClick={handleLogout} disabled={adminLogout.isPending}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {adminLogout.isPending ? 'Logging out...' : 'Logout'}
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <Outlet />
        </main>

        {/* Admin Footer */}
        <footer className="border-t bg-card py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Admin Panel - Hi-Tech Pharmaceuticals Pvt. Ltd.</p>
          </div>
        </footer>
      </div>
    </AdminRouteGuard>
  );
}
