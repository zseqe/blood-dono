// frontend/app/dashboard/page.tsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import { Donor, RankedDonor } from '@/lib/definitions';
import { BloodType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
// --- CORRECTED IMPORT PATH ---
import { useToast } from "@/hooks/use-toast";
// --- END CORRECTION ---
import { Input } from "@/components/ui/input";
import { RefreshCw, LogOut, Search, Activity, Users, Hourglass, Droplets, ArrowUpDown, Info, XCircle, CheckSquare, Ban } from 'lucide-react';
import { DonorCard } from '../_components/donor-card';
import { ModeToggle } from '@/components/theme-toggle';

interface DashboardStats { /* ... */ }
type SortKey = keyof Pick<Donor, 'full_name' | 'blood_type' | 'location' | 'status' | 'last_donation_date'> | null;
type SortDirection = 'asc' | 'desc';
const formatDate = (dateString: string | null | undefined): string => { /* ... */ if (!dateString) return 'N/A'; try { return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return 'Invalid Date'; } };

export default function DashboardPage() {
  // ... (all state variables and functions remain exactly the same as the last version) ...
  const [bloodType, setBloodType] = useState<BloodType>(BloodType.AP);
  const [rankedDonors, setRankedDonors] = useState<RankedDonor[]>([]);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('full_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => { if (!isAuthenticated()) router.push('/login'); else handleRefreshData(); }, [isAuthenticated, router]);
  const handleRefreshData = async () => { setIsLoadingData(true); setSearchError(null); try { const [statsRes, donorsRes] = await Promise.all([api.get('/hospitals/dashboard/stats'), api.get('/dashboard/donors')]); setStats(statsRes.data); setAllDonors(donorsRes.data); } catch(err){ console.error("Refresh failed", err); toast({ title: "Error", description: "Could not refresh data.", variant: "destructive" }); } finally { setIsLoadingData(false); } };
  const handleSearch = async () => { setIsLoadingSearch(true); setSearchError(null); setRankedDonors([]); try { const res = await api.post('/dashboard/find-matches', { blood_type_needed: bloodType }); setRankedDonors(res.data); if (res.data.length === 0) setSearchError('No active donors found.'); } catch (err) { setSearchError('Search error.'); } finally { setIsLoadingSearch(false); } };
  const handleApprove = async (donorId: number) => { try { await api.patch(`/dashboard/donors/${donorId}/approve`); toast({ title: "Success", description: "Donor approved." }); handleRefreshData(); } catch (err) { console.error("Approve failed", err); toast({ title: "Error", description: "Could not approve.", variant: "destructive" }); } };
  const handleDecline = async (donorId: number) => { try { await api.patch(`/dashboard/donors/${donorId}/decline`); toast({ title: "Donor Declined", description: "Donor status set to inactive."}); handleRefreshData(); } catch (err) { console.error("Failed to decline donor", err); toast({ title: "Error", description: "Could not decline donor.", variant: "destructive" }); } };
  const handleSort = (key: SortKey) => { if (!key) return; if (sortKey === key) { setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); } else { setSortKey(key); setSortDirection('asc'); } };
  const pendingDonors = useMemo(() => { return allDonors.filter(d => d.status === 'pending_approval').sort((a, b) => b.id - a.id); }, [allDonors]);
  const sortedManagedDonors = useMemo(() => {
      const managed = allDonors.filter(d => {
          if (d.status === 'pending_approval') return false;
          if (statusFilter !== 'all' && d.status !== statusFilter) return false;
          const searchLower = searchTerm.toLowerCase();
          if (searchTerm && !d.full_name.toLowerCase().includes(searchLower) && !d.email.toLowerCase().includes(searchLower) && !d.phone.includes(searchTerm)) return false;
          return true;
      });
      if (!sortKey) return managed;
      return [...managed].sort((a, b) => { if (sortKey === 'last_donation_date') { const dateA = a.last_donation_date ? new Date(a.last_donation_date).getTime() : 0; const dateB = b.last_donation_date ? new Date(b.last_donation_date).getTime() : 0; return sortDirection === 'asc' ? dateA - dateB : dateB - dateA; } const valA = a[sortKey as keyof Donor] ?? ''; const valB = b[sortKey as keyof Donor] ?? ''; let comp = 0; if (valA > valB) comp = 1; else if (valA < valB) comp = -1; return sortDirection === 'asc' ? comp : comp * -1; });
  }, [allDonors, sortKey, sortDirection, searchTerm, statusFilter]);
  const managedDonorsCount = sortedManagedDonors.length;
   const renderStatus = (status: string) => { if (status === 'active') { return <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400"><CheckSquare className="h-4 w-4" /> Active</span>; } else if (status === 'inactive') { return <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><Ban className="h-4 w-4" /> Inactive</span>; } return <span className="text-sm text-slate-500 dark:text-slate-400">{status}</span>; };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-brand-dark_bg dark:via-gray-900 dark:to-teal-900">
      <header className="bg-card shadow-md sticky top-0 z-10 border-b">
           {/* ... Header ... */}
      </header>

      <main className="container mx-auto p-4 md:p-8 space-y-8">
        {/* --- Stats Cards --- */}
        <section className="grid gap-6 md:grid-cols-3">
             {/* ... Stats Cards ... */}
        </section>

        {/* --- Collapsible Pending Donors --- */}
        <Card className="shadow-lg rounded-lg border overflow-hidden bg-card">
           <Accordion type="single" collapsible className="w-full" defaultValue="pending-donors">
             {/* ... Pending Accordion ... */}
           </Accordion>
        </Card>

        {/* --- Collapsible Manage Donors Table (No Edit) --- */}
        <Accordion type="single" collapsible className="w-full" defaultValue="manage-donors">
          <AccordionItem value="manage-donors" className="border-none">
             <Card className="shadow-lg rounded-lg border overflow-hidden bg-card">
                {/* ... Manage Accordion ... */}
             </Card>
          </AccordionItem>
        </Accordion>

        {/* --- AI Factor Explanation Card --- */}
        <Card className="shadow-lg rounded-lg border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-800 dark:via-cyan-900 dark:to-teal-900 overflow-hidden">
             {/* ... AI Explanation ... */}
        </Card>

        {/* --- Search Section --- */}
        <Card className="shadow-lg rounded-lg border overflow-hidden bg-card">
           {/* ... Search Card ... */}
        </Card>

        {/* --- Search Results --- */}
        {(isLoadingSearch || rankedDonors.length > 0 || searchError) && (
            <section className="mt-8">
                 {/* ... Search Results ... */}
            </section>
        )}
      </main>

       <footer className="py-6 mt-12 border-t bg-card">
           {/* ... Footer ... */}
       </footer>
    </div>
  );
}