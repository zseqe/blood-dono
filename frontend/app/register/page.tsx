// frontend/app/register/page.tsx
// Corrected import path for useToast.

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'sonner';
// Shadcn UI Components & Icons
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
// --- CORRECTED IMPORT PATH ---
// --- END CORRECTION ---
import { UserPlus } from 'lucide-react';
import { ModeToggle } from '@/components/theme-toggle';

interface Hospital {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    blood_type: '',
    location: '',
    hospital_id: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/hospitals/');
        setHospitals(
          response.data.sort((a: Hospital, b: Hospital) => a.name.localeCompare(b.name))
        );
      } catch (err) {
        setError('Could not load hospitals list.');
      }
    };
    fetchHospitals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        hospital_id: parseInt(formData.hospital_id),
      };
      if (isNaN(payload.hospital_id)) throw new Error('Invalid hospital.');
      await api.post('/donors/register', payload);
      toast.success('Registration Submitted!', {
        description: 'Thank you!',
      });
      setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (err) {
      console.error('Reg failed:', err);
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error('Registration Failed', {
          description: err.response?.data?.detail || 'Email/phone exists.',
        });
      } else {
        setError('Registration failed. Check details.');
      }
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-brand-dark_bg dark:via-gray-900 dark:to-red-900/50">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-lg shadow-xl rounded-lg">
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="mx-auto mb-3 h-12 w-12 text-brand-red">
            {' '}
            <UserPlus size={48} />{' '}
          </div>
          <CardTitle className="text-2xl font-bold text-brand-red">Become a Lifesaver</CardTitle>
          <CardDescription className="text-muted-foreground">
            {' '}
            Register your details to become a potential blood donor.{' '}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-sm font-medium text-muted-foreground">
                Full Name
              </Label>
              <Input
                id="full_name"
                required
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Your Full Name"
                className="rounded-md shadow-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                {' '}
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  Email
                </Label>{' '}
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  className="rounded-md shadow-sm"
                />{' '}
              </div>
              <div className="space-y-1.5">
                {' '}
                <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </Label>{' '}
                <Input
                  id="phone"
                  type="tel"
                  required
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="+91..."
                  className="rounded-md shadow-sm"
                />{' '}
              </div>
            </div>
            <div className="space-y-1.5">
              {' '}
              <Label htmlFor="location" className="text-sm font-medium text-muted-foreground">
                Your Location (City, State)
              </Label>{' '}
              <Input
                id="location"
                required
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g., Mangalore, Karnataka"
                className="rounded-md shadow-sm"
              />{' '}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                {' '}
                <Label htmlFor="blood_type" className="text-sm font-medium text-muted-foreground">
                  Blood Type
                </Label>{' '}
                <Select
                  onValueChange={(value) => handleSelectChange('blood_type', value)}
                  required
                  disabled={isLoading}
                >
                  {' '}
                  <SelectTrigger className="rounded-md shadow-sm">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>{' '}
                  <SelectContent>
                    {' '}
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    ))}{' '}
                  </SelectContent>{' '}
                </Select>{' '}
              </div>
              <div className="space-y-1.5">
                {' '}
                <Label htmlFor="hospital_id" className="text-sm font-medium text-muted-foreground">
                  Affiliated Hospital
                </Label>{' '}
                <Select
                  onValueChange={(value) => handleSelectChange('hospital_id', value)}
                  required
                  disabled={isLoading || !hospitals.length}
                >
                  {' '}
                  <SelectTrigger className="rounded-md shadow-sm">
                    <SelectValue
                      placeholder={hospitals.length ? 'Select hospital...' : 'Loading...'}
                    />
                  </SelectTrigger>{' '}
                  <SelectContent>
                    {' '}
                    {hospitals.map((h) => (
                      <SelectItem key={h.id} value={String(h.id)}>
                        {h.name}
                      </SelectItem>
                    ))}{' '}
                  </SelectContent>{' '}
                </Select>{' '}
              </div>
            </div>
            {error && <p className="text-sm text-destructive px-1 pt-1">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-darkred text-white rounded-md py-2.5 font-semibold shadow-md transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Registration'}
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
