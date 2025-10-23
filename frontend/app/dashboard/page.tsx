'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Users, LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/theme-toggle';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, hospitalName, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-neutral via-white to-brand-teal/5">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-neutral-dark shadow-soft">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-teal to-brand-teal-light rounded-xl">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-brand-teal">LIFELINK</span>
              <p className="text-sm text-brand-graphite">{hospitalName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-graphite-dark mb-2">Hospital Dashboard</h1>
          <p className="text-brand-graphite">Manage donors and blood requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-soft rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-graphite">
                Total Donors
              </CardTitle>
              <Users className="h-4 w-4 text-brand-teal" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-graphite-dark">Loading...</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-soft rounded-xl">
          <CardHeader>
            <CardTitle className="text-brand-graphite-dark">Dashboard Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-brand-graphite">
              Full dashboard with donor management, AI ranking, and analytics will be available
              shortly.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
