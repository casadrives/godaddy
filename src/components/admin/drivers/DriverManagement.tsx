import React, { useEffect, useState } from 'react';
import { useDriverStore, Driver } from '@/services/driverService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export function DriverManagement() {
  const { drivers, generateMockDrivers, updateDriver } = useDriverStore();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Generate 50 mock drivers if none exist
  useEffect(() => {
    if (drivers.length === 0) {
      generateMockDrivers(50);
      toast.success('Generated 50 economy car drivers');
    }
  }, [drivers.length, generateMockDrivers]);

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Driver['status']) => {
    const variants = {
      active: 'bg-green-50 text-green-700',
      inactive: 'bg-gray-50 text-gray-700',
      suspended: 'bg-red-50 text-red-700',
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleStatusChange = (driverId: string, newStatus: Driver['status']) => {
    updateDriver(driverId, { status: newStatus });
    toast.success(`Driver status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Driver Management</CardTitle>
              <CardDescription>
                Manage and monitor taxi drivers in Luxembourg
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or license plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Trips</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={driver.profileImage} />
                        <AvatarFallback>
                          {driver.firstName[0]}
                          {driver.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {driver.firstName} {driver.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{driver.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {driver.vehicle.make} {driver.vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {driver.vehicle.licensePlate} • {driver.vehicle.color}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{driver.rating.toFixed(1)}</span>
                      <span className="text-yellow-500 ml-1">★</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{driver.totalTrips}</div>
                      <div className="text-sm text-gray-500">
                        €{driver.totalEarnings.toFixed(2)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Select
                        value={driver.status}
                        onValueChange={(value: Driver['status']) =>
                          handleStatusChange(driver.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Set Active</SelectItem>
                          <SelectItem value="inactive">Set Inactive</SelectItem>
                          <SelectItem value="suspended">Suspend</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDriver(driver);
                          setIsDetailsOpen(true);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Full Name:</span>{' '}
                    {selectedDriver.firstName} {selectedDriver.lastName}
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>{' '}
                    {selectedDriver.email}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>{' '}
                    {selectedDriver.phone}
                  </div>
                  <div>
                    <span className="text-gray-500">License:</span>{' '}
                    {selectedDriver.licenseNumber}
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span>{' '}
                    {selectedDriver.address}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vehicle Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Vehicle:</span>{' '}
                    {selectedDriver.vehicle.make} {selectedDriver.vehicle.model}{' '}
                    {selectedDriver.vehicle.year}
                  </div>
                  <div>
                    <span className="text-gray-500">License Plate:</span>{' '}
                    {selectedDriver.vehicle.licensePlate}
                  </div>
                  <div>
                    <span className="text-gray-500">Color:</span>{' '}
                    {selectedDriver.vehicle.color}
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>{' '}
                    {selectedDriver.vehicle.type}
                  </div>
                </div>
                <h3 className="font-semibold mt-4 mb-2">Performance</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-500">Rating:</span>{' '}
                    {selectedDriver.rating.toFixed(1)} ★
                  </div>
                  <div>
                    <span className="text-gray-500">Total Trips:</span>{' '}
                    {selectedDriver.totalTrips}
                  </div>
                  <div>
                    <span className="text-gray-500">Total Earnings:</span>{' '}
                    €{selectedDriver.totalEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
