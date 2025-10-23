'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useAuthStore } from '@/lib/authStore';
import api from '@/lib/api';
import { Donor, RankedDonor } from '@/lib/definitions';
import { BloodType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  RefreshCw,
  LogOut,
  Search,
  Activity,
  Users,
  Hourglass,
  Droplets,
  ArrowUpDown,
  CheckSquare,
  Ban,
  XCircle,
} from 'lucide-react';
import { ModeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

// Types
interface DashboardStats {
  total_donors: number;
  active_donors: number;
  pending_donors: number;
}

// Utility functions
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Never';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckSquare className="h-4 w-4 text-green-600" />;
    case 'inactive':
      return <Ban className="h-4 w-4 text-red-600" />;
    case 'pending_approval':
      return <Hourglass className="h-4 w-4 text-yellow-600" />;
    default:
      return <XCircle className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 dark:text-green-400';
    case 'inactive':
      return 'text-red-600 dark:text-red-400';
    case 'pending_approval':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Column helper for react-table
const columnHelper = createColumnHelper<Donor>();

export default function DashboardPage() {
  // State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);
  const [rankedDonors, setRankedDonors] = useState<RankedDonor[]>([]);
  const [bloodType, setBloodType] = useState<BloodType>(BloodType.AP);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Auth and router
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // Table columns definition
  const columns = useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ getValue }) => <div className="text-sm text-muted-foreground">{getValue()}</div>,
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ getValue }) => <div className="text-sm">{getValue()}</div>,
      }),
      columnHelper.accessor('blood_type', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Blood Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-red-500" />
            <span className="font-medium">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('location', {
        header: 'Location',
        cell: ({ getValue }) => <div className="text-sm">{getValue()}</div>,
      }),
      columnHelper.accessor('status', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="capitalize">{status.replace('_', ' ')}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('last_donation_date', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Last Donation
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => <div className="text-sm">{formatDate(getValue())}</div>,
      }),
      columnHelper.accessor('reliability_score', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 lg:px-3"
          >
            Reliability
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ getValue }) => (
          <div className="text-sm font-medium">{(getValue() * 100).toFixed(0)}%</div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const donor = row.original;
          if (donor.status === 'pending_approval') {
            return (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(donor.id)} className="h-8">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDecline(donor.id)}
                  className="h-8"
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </div>
            );
          }
          return <span className="text-sm text-muted-foreground">-</span>;
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Table instance
  const table = useReactTable({
    data: allDonors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  // Effects
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      fetchData();
    }
  }, [isAuthenticated, router]);

  // Functions
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, donorsRes] = await Promise.all([
        api.get('/hospitals/dashboard/stats'),
        api.get('/dashboard/donors'),
      ]);
      setStats(statsRes.data);
      setAllDonors(donorsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    setRankedDonors([]);

    try {
      const response = await api.post('/dashboard/find-matches', {
        blood_type_needed: bloodType,
      });
      setRankedDonors(response.data);

      if (response.data.length === 0) {
        setSearchError('No active donors found for this blood type.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Failed to search for donors. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApprove = async (donorId: number) => {
    try {
      await api.patch(`/dashboard/donors/${donorId}/approve`);
      toast.success('Donor approved successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to approve donor:', error);
      toast.error('Failed to approve donor');
    }
  };

  const handleDecline = async (donorId: number) => {
    try {
      await api.patch(`/dashboard/donors/${donorId}/decline`);
      toast.success('Donor declined successfully');
      fetchData();
    } catch (error) {
      console.error('Failed to decline donor:', error);
      toast.error('Failed to decline donor');
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push('/login');
  };

  // Filtered data for pending donors
  const pendingDonors = useMemo(
    () => allDonors.filter((donor) => donor.status === 'pending_approval'),
    [allDonors]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Blood Donor Dashboard
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Hospital Management System</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_donors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Donors</CardTitle>
                <CheckSquare className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active_donors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Hourglass className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending_donors}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pending Donors Section */}
        {pendingDonors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hourglass className="h-5 w-5 text-yellow-600" />
                Pending Approval ({pendingDonors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDonors.map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{donor.full_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {donor.email} • {donor.phone}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm">
                            <Droplets className="h-4 w-4 inline mr-1" />
                            {donor.blood_type}
                          </span>
                          <span className="text-sm">{donor.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(donor.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckSquare className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDecline(donor.id)}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Donor Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Blood Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="blood-type">Blood Type Needed</Label>
                <Select
                  value={bloodType}
                  onValueChange={(value) => setBloodType(value as BloodType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BloodType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search Donors
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {(rankedDonors.length > 0 || searchError) && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              {searchError ? (
                <div className="text-center py-8 text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p>{searchError}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rankedDonors.map((rankedDonor) => (
                    <div
                      key={rankedDonor.donor.id}
                      className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{rankedDonor.donor.full_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {rankedDonor.donor.email} • {rankedDonor.donor.phone}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm">
                              <Droplets className="h-4 w-4 inline mr-1" />
                              {rankedDonor.donor.blood_type}
                            </span>
                            <span className="text-sm">{rankedDonor.donor.location}</span>
                            <span className="text-sm">
                              Reliability: {(rankedDonor.donor.reliability_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            #{rankedDonor.rank}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {(rankedDonor.probability_score * 100).toFixed(0)}% match
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                        <p className="text-sm">{rankedDonor.explanation_human}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Donors Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Donors</CardTitle>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search donors..."
                  value={(table.getColumn('full_name')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('full_name')?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <Button onClick={fetchData} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No donors found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
