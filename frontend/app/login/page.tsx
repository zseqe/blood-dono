// frontend/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
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
import { LogIn } from 'lucide-react';
import { ModeToggle } from '@/components/theme-toggle'; // Added ModeToggle

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    try {
      const response = await api.post('/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token } = response.data;
      setToken(access_token);
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check credentials.');
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-brand-lightblue via-white to-blue-50 dark:from-brand-dark_bg dark:via-gray-900 dark:to-teal-900">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-sm shadow-xl rounded-lg">
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="mx-auto mb-3 h-12 w-12 text-brand-teal">
            {' '}
            <LogIn size={48} />{' '}
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Hospital Portal</CardTitle>
          <CardDescription className="text-muted-foreground">
            {' '}
            Access Donor Management System{' '}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hospital.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="rounded-md shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="rounded-md shadow-sm"
              />
            </div>
            {error && <p className="text-sm text-destructive px-1 pt-1">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-brand-teal hover:bg-opacity-90 text-white rounded-md py-2.5 font-semibold shadow-md transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm pb-8">
          <Link href="/" className="text-brand-teal hover:underline">
            {' '}
            ← Back to Home{' '}
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
