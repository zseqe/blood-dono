// frontend/app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Droplets, HeartPulse, BrainCircuit, Users } from 'lucide-react';
import { ModeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-6 md:px-10 bg-card/80 backdrop-blur-sm sticky top-0 z-10 border-b">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-lg text-brand-red">
            <Droplets /> Smart Blood Platform
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Hospital Login</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-6 py-16 md:py-24 text-center flex flex-col items-center">
          <div className="mb-8">
            <div className="p-8 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/50 dark:to-teal-900/50 rounded-full inline-block animate-pulse-slow">
              <HeartPulse className="h-20 w-20 text-brand-red" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground leading-tight">
            Saving Lives with <span className="text-brand-sky">Smart</span> Matching
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Our AI-powered platform intelligently connects voluntary blood donors with hospitals,
            ensuring timely and compatible matches when it matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-brand-red hover:bg-brand-darkred text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/register">Become a Donor Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-card hover:bg-muted"
            >
              <Link href="/login">Hospital Portal Access</Link>
            </Button>
          </div>
        </section>

        <section className="bg-card py-16 md:py-20 border-t border-b">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <BrainCircuit className="h-12 w-12 text-brand-sky mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">AI-Powered Ranking</h3>
              <p className="text-muted-foreground">
                Our intelligent algorithms rank donors based on compatibility, reliability, and
                proximity.
              </p>
            </div>
            <div className="p-6">
              <Users className="h-12 w-12 text-brand-teal mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Seamless Connection</h3>
              <p className="text-muted-foreground">
                Bridging the gap between hospitals, donors, and those in need efficiently.
              </p>
            </div>
            <div className="p-6">
              <HeartPulse className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Community Impact</h3>
              <p className="text-muted-foreground">
                Join a network of lifesavers and make a real difference in your community.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-muted/50 border-t">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smart Blood Platform. Powered by AI for a healthier
          tomorrow.
        </div>
      </footer>
    </div>
  );
}
