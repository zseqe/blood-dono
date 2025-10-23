'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/theme-toggle';
import {
  Droplets,
  Heart,
  Brain,
  Users,
  MapPin,
  Phone,
  Mail,
  Award,
  Zap,
  Shield,
  HeartHandshake,
} from 'lucide-react';

export default function HomePage() {
  const [donorCount, setDonorCount] = useState(0);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setDonorCount(data.total_donors || 0))
      .catch((err) => console.error('Failed to fetch stats:', err));
  }, []);

  const hospitals = [
    {
      name: 'Apollo Hospitals',
      city: 'Bangalore',
      state: 'Karnataka',
      phone: '+912240404040',
      address: '154, Bannerghatta Road',
    },
    {
      name: 'Fortis Healthcare',
      city: 'Delhi',
      state: 'Delhi',
      phone: '+911166214444',
      address: 'Sector 62, Phase VIII',
    },
    {
      name: 'Lilavati Hospital',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+912226567000',
      address: 'A-791, Bandra Reclamation',
    },
    {
      name: 'KIMS Hospitals',
      city: 'Hyderabad',
      state: 'Telangana',
      phone: '+914044885000',
      address: '1-8-31/1, Minister Road',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-brand-neutral via-white to-brand-teal/5">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-neutral-dark shadow-soft">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-teal to-brand-teal-light rounded-xl">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-teal-light bg-clip-text text-transparent">
              LIFELINK
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
              variant="outline"
              asChild
              className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white transition-all duration-300"
            >
              <Link href="/login">Hospital Login</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative container mx-auto px-6 py-20 md:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-brand-lemon/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl"></div>
          </div>

          <div className="mb-8 inline-block">
            <div className="relative p-6 bg-gradient-to-br from-brand-teal/10 to-brand-lemon/10 rounded-full animate-pulse">
              <Heart className="h-24 w-24 text-brand-teal" />
              <div className="absolute -top-2 -right-2 bg-brand-lemon text-brand-graphite-dark px-3 py-1 rounded-full text-sm font-bold shadow-soft">
                {donorCount}+
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Save Lives with <span className="text-brand-teal">Intelligence</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-brand-graphite mb-10 leading-relaxed">
            Connecting donors and hospitals through smart matching. Our AI-powered platform ensures
            timely and compatible blood donations when every second counts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-brand-teal hover:bg-brand-teal-dark text-white shadow-soft-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl text-lg px-8 py-6"
            >
              <Link href="/register">Become a Donor Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-brand-lemon text-brand-graphite-dark hover:bg-brand-lemon hover:text-brand-graphite-dark shadow-soft hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 rounded-xl text-lg px-8 py-6"
            >
              <Link href="/login">Hospital Portal</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-none shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl">
              <CardContent className="pt-6 text-center">
                <div className="inline-block p-4 bg-brand-teal/10 rounded-xl mb-4">
                  <Users className="h-8 w-8 text-brand-teal" />
                </div>
                <h3 className="text-2xl font-bold text-brand-graphite-dark">{donorCount}+</h3>
                <p className="text-brand-graphite">Registered Donors</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl">
              <CardContent className="pt-6 text-center">
                <div className="inline-block p-4 bg-brand-lemon/20 rounded-xl mb-4">
                  <Heart className="h-8 w-8 text-brand-accent" />
                </div>
                <h3 className="text-2xl font-bold text-brand-graphite-dark">4</h3>
                <p className="text-brand-graphite">Partner Hospitals</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl">
              <CardContent className="pt-6 text-center">
                <div className="inline-block p-4 bg-brand-teal-light/20 rounded-xl mb-4">
                  <Zap className="h-8 w-8 text-brand-teal-light" />
                </div>
                <h3 className="text-2xl font-bold text-brand-graphite-dark">95%</h3>
                <p className="text-brand-graphite">Match Success Rate</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white py-20 border-y border-brand-neutral-dark">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-brand-graphite-dark mb-4">
                Why Choose LIFELINK?
              </h2>
              <p className="text-lg text-brand-graphite max-w-2xl mx-auto">
                Advanced technology meets compassionate care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-none shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl group hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-brand-teal to-brand-teal-light rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-graphite-dark">
                    AI-Powered Matching
                  </h3>
                  <p className="text-brand-graphite leading-relaxed">
                    Intelligent algorithms rank donors based on compatibility, reliability, and
                    proximity for optimal matches.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl group hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-brand-lemon to-brand-lemon-dark rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-graphite-dark">
                    Secure & Private
                  </h3>
                  <p className="text-brand-graphite leading-relaxed">
                    Your data is protected with bank-level security. Full GDPR compliance with
                    consent-based sharing.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl group hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-brand-accent to-brand-lemon rounded-xl mb-4 group-hover:scale-110 transition-transform">
                    <HeartHandshake className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-graphite-dark">
                    Real-Time Connection
                  </h3>
                  <p className="text-brand-graphite leading-relaxed">
                    Instant notifications connect donors with hospitals when every moment matters
                    most.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-brand-teal/5 to-brand-lemon/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-brand-graphite-dark mb-4">
                Our Partner Hospitals
              </h2>
              <p className="text-lg text-brand-graphite max-w-2xl mx-auto">
                Trusted healthcare institutions across India
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {hospitals.map((hospital) => (
                <Card
                  key={hospital.name}
                  className="border-none shadow-soft hover:shadow-soft-lg transition-all duration-300 rounded-xl hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-brand-teal/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-brand-teal" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-brand-graphite-dark">
                          {hospital.name}
                        </CardTitle>
                        <CardDescription className="text-brand-graphite">
                          {hospital.city}, {hospital.state}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-brand-graphite">
                      <Phone className="h-4 w-4" />
                      <span>{hospital.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-graphite">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.address}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-brand-teal to-brand-teal-dark text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <Award className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Save Lives?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Join our community of lifesavers today. Registration takes less than 2 minutes.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-lemon hover:bg-brand-lemon-dark text-brand-graphite-dark font-bold shadow-soft-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl text-lg px-8 py-6"
            >
              <Link href="/register">Register as Donor</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-brand-graphite-dark text-white py-12 border-t border-brand-graphite">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-teal rounded-xl">
                  <Droplets className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">LIFELINK</span>
              </div>
              <p className="text-brand-graphite-light">
                Saving lives through intelligent blood donor matching.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/register"
                    className="text-brand-graphite-light hover:text-white transition-colors"
                  >
                    Become a Donor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-brand-graphite-light hover:text-white transition-colors"
                  >
                    Hospital Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-brand-graphite-light">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@lifelink.in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>1800-LIFELINK</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-graphite pt-6 text-center text-brand-graphite-light">
            <p>
              &copy; {new Date().getFullYear()} LIFELINK. Powered by AI for a healthier tomorrow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
