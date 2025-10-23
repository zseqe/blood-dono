'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ModeToggle } from '@/components/theme-toggle';
import { UserPlus, Droplets } from 'lucide-react';
import { toast } from 'sonner';

interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function RegisterPage() {
  const router = useRouter();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    blood_type: '',
    date_of_birth: '',
    gender: '',
    weight: '',
    city: '',
    state: '',
    location_address: '',
    medications: '',
    hospital_id: '',
  });

  useEffect(() => {
    fetch('/api/hospitals')
      .then((res) => res.json())
      .then((data) => setHospitals(data))
      .catch((err) => console.error('Failed to fetch hospitals:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/donors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      toast.success('Registration successful!');
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-lemon/10 via-white to-brand-teal/10 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-3xl shadow-soft-lg border-none rounded-xl">
        <CardHeader className="text-center space-y-2 pt-8 pb-6">
          <div className="mx-auto mb-3 p-3 bg-gradient-to-br from-brand-teal to-brand-teal-light rounded-xl inline-block">
            <UserPlus className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-brand-graphite-dark">
            Become a Lifesaver
          </CardTitle>
          <CardDescription className="text-brand-graphite">
            Register as a blood donor and help save lives in your community
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-brand-graphite-dark font-medium">
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  required
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter your full name"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-brand-graphite-dark font-medium">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="you@example.com"
                    className="mt-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-brand-graphite-dark font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="+91..."
                    className="mt-1.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="blood_type" className="text-brand-graphite-dark font-medium">
                    Blood Type *
                  </Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('blood_type', value)}
                    required
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1.5 rounded-lg">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-brand-teal" />
                            {type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date_of_birth" className="text-brand-graphite-dark font-medium">
                    Date of Birth
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    onChange={handleChange}
                    disabled={isLoading}
                    className="mt-1.5 rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="gender" className="text-brand-graphite-dark font-medium">
                    Gender
                  </Label>
                  <Select
                    onValueChange={(value) => handleSelectChange('gender', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="mt-1.5 rounded-lg">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-brand-graphite-dark font-medium">
                    City *
                  </Label>
                  <Input
                    id="city"
                    required
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="e.g., Mumbai"
                    className="mt-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-brand-graphite-dark font-medium">
                    State *
                  </Label>
                  <Input
                    id="state"
                    required
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="e.g., Maharashtra"
                    className="mt-1.5 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location_address" className="text-brand-graphite-dark font-medium">
                  Address
                </Label>
                <Input
                  id="location_address"
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Full address"
                  className="mt-1.5 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight" className="text-brand-graphite-dark font-medium">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="e.g., 65"
                    className="mt-1.5 rounded-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="medications" className="text-brand-graphite-dark font-medium">
                    Current Medications
                  </Label>
                  <Input
                    id="medications"
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="None or list medications"
                    className="mt-1.5 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hospital_id" className="text-brand-graphite-dark font-medium">
                  Preferred Hospital *
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange('hospital_id', value)}
                  required
                  disabled={isLoading || !hospitals.length}
                >
                  <SelectTrigger className="mt-1.5 rounded-lg">
                    <SelectValue
                      placeholder={hospitals.length ? 'Select hospital...' : 'Loading...'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name} - {h.city}, {h.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-lg py-6 text-lg font-semibold shadow-soft-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Register as Donor'}
            </Button>
          </form>
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
