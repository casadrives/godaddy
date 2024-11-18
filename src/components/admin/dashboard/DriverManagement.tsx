import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Euro,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { DRIVER_SUBSCRIPTION } from '@/config/pricing';

interface Driver {
  id: string;
  name: string;
  email: string;
  subscriptionStatus: 'active' | 'inactive' | 'pending';
  lastPayment: Date;
  nextPayment: Date;
  totalEarnings: number;
  totalCommission: number;
  totalRides: number;
}

export function DriverManagement() {
  // Mock data - replace with real API data
  const [drivers, setDrivers] = React.useState<Driver[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subscriptionStatus: 'active',
      lastPayment: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      nextPayment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      totalEarnings: 1250.75,
      totalCommission: 220.75,
      totalRides: 45,
    },
    // Add more mock drivers
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || driver.subscriptionStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalCommission = filteredDrivers.reduce((sum, driver) => sum + driver.totalCommission, 0);
  const activeSubscriptions = filteredDrivers.filter(d => d.subscriptionStatus === 'active').length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Commission</h3>
          <div className="mt-2 flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            <span className="text-2xl font-bold">{totalCommission.toFixed(2)}</span>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Active Subscriptions</h3>
          <div className="mt-2 flex items-center">
            <span className="text-2xl font-bold">{activeSubscriptions}</span>
            <span className="text-sm text-muted-foreground ml-2">of {drivers.length}</span>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Monthly Subscription Fee</h3>
          <div className="mt-2 flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            <span className="text-2xl font-bold">{DRIVER_SUBSCRIPTION.monthlyFee.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'active' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </Button>
            <Button
              variant={filterStatus === 'inactive' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('inactive')}
            >
              Inactive
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </Button>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Drivers Table */}
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead className="text-right">Total Earnings</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-muted-foreground">{driver.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(driver.subscriptionStatus)}`}>
                    {driver.subscriptionStatus.charAt(0).toUpperCase() + driver.subscriptionStatus.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{driver.lastPayment.toLocaleDateString()}</TableCell>
                <TableCell>{driver.nextPayment.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">€{driver.totalEarnings.toFixed(2)}</TableCell>
                <TableCell className="text-right">€{driver.totalCommission.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {driver.subscriptionStatus === 'pending' && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {driver.subscriptionStatus === 'inactive' && (
                      <Button size="sm">
                        Activate
                      </Button>
                    )}
                    {driver.subscriptionStatus === 'active' && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
