import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { taxiCompanyService } from '@/services/taxiCompanyService';
import { TaxiCompanyForm } from './TaxiCompanyForm';
import { TaxiCompanyAnalytics } from './TaxiCompanyAnalytics';
import { LoginForm } from '../auth/LoginForm';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import {
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export function TaxiCompanies() {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isAuthenticated, user, logout } = useAuthStore();

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Fetch companies
  const { data: companies, isLoading } = useQuery({
    queryKey: ['taxiCompanies'],
    queryFn: () => taxiCompanyService.getCompanies(),
  });

  // Fetch analytics for selected company
  const { data: analytics } = useQuery({
    queryKey: ['taxiCompanyAnalytics', selectedCompany],
    queryFn: () =>
      selectedCompany
        ? taxiCompanyService.getCompanyAnalytics(selectedCompany)
        : null,
    enabled: !!selectedCompany && isAnalyticsOpen,
  });

  // Mutations
  const createCompany = useMutation({
    mutationFn: taxiCompanyService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxiCompanies'] });
      setIsFormOpen(false);
      toast.success('Company created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create company: ' + error.message);
    },
  });

  const updateCompany = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      taxiCompanyService.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxiCompanies'] });
      setIsFormOpen(false);
      toast.success('Company updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update company: ' + error.message);
    },
  });

  const deleteCompany = useMutation({
    mutationFn: taxiCompanyService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxiCompanies'] });
      toast.success('Company deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete company: ' + error.message);
    },
  });

  const handleToggleActive = (id: string, currentActive: boolean) => {
    updateCompany.mutate({
      id,
      data: { active: !currentActive },
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const selectedCompanyData = companies?.find((c) => c.id === selectedCompany);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Luxembourg Taxi Companies</CardTitle>
              <CardDescription>
                Manage and monitor major taxi companies operating in Luxembourg
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Logged in as {user?.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button onClick={() => {
                setSelectedCompany(null);
                setIsFormOpen(true);
              }}>
                Add Company
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Fleet Size</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies?.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.fleetSize} vehicles</TableCell>
                    <TableCell>{company.rating.toFixed(1)}/5.0</TableCell>
                    <TableCell>{company.averageResponseTime} mins</TableCell>
                    <TableCell>
                      <Switch
                        checked={company.active}
                        onCheckedChange={() =>
                          handleToggleActive(company.id, company.active)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company.id);
                            setIsFormOpen(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this company?'
                              )
                            ) {
                              deleteCompany.mutate(company.id);
                            }
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company.id);
                            setIsAnalyticsOpen(true);
                          }}
                        >
                          <ChartBarIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Company Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCompany ? 'Edit' : 'Add'} Taxi Company
            </DialogTitle>
          </DialogHeader>
          <TaxiCompanyForm
            initialData={selectedCompanyData}
            onSubmit={(data) => {
              if (selectedCompany) {
                updateCompany.mutate({ id: selectedCompany, data });
              } else {
                createCompany.mutate(data);
              }
            }}
            onCancel={() => {
              setSelectedCompany(null);
              setIsFormOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCompanyData?.name} - Performance Analytics
            </DialogTitle>
          </DialogHeader>
          {analytics && <TaxiCompanyAnalytics analytics={analytics} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
