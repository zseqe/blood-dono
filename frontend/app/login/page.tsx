'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ModeToggle } from '@/components/theme-toggle';
import { LogIn, Hospital } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setAuth(data.token, data.hospital.id, data.hospital.name);
      toast.success(`Welcome, ${data.hospital.name}!`);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal/10 via-white to-brand-lemon/10 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md shadow-soft-lg border-none rounded-xl">
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="mx-auto mb-3 p-3 bg-gradient-to-br from-brand-teal to-brand-teal-light rounded-xl inline-block">
            <Hospital className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-brand-graphite-dark">
            Hospital Portal
          </CardTitle>
          <CardDescription className="text-brand-graphite">
            Access your donor management dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-brand-graphite-dark font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="admin@hospital.com"
                className="mt-1.5 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-brand-graphite-dark font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="mt-1.5 rounded-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-lg py-6 text-lg font-semibold shadow-soft-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-brand-lemon/10 rounded-lg">
            <p className="text-sm text-brand-graphite-dark font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-brand-graphite">
              admin@apollo.in / apollo123
              <br />
              admin@fortis.in / fortis123
              <br />
              admin@lilavati.in / lilavati123
              <br />
              admin@kims.in / kims123
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center text-sm pb-8">
          <Link
            href="/"
            className="text-brand-teal hover:text-brand-teal-dark transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
