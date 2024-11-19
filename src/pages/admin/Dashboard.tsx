import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/ui/data-table';
import { BarChart, LineChart } from '@/components/ui/charts';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { toast } from '@/components/ui/toast';

export function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [revenue, setRevenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dashboardStats, activity, revenueStats] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentActivity(),
        adminService.getRevenueStats()
      ]);

      setStats(dashboardStats);
      setRecentActivity(activity);
      setRevenue(revenueStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            {trend > 0 ? '+' : ''}{trend}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t('admin.dashboard.welcome', { name: user?.name })}
          </h1>
          <p className="text-muted-foreground">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <Button onClick={loadDashboardData}>
          <Icons.refresh className="mr-2 h-4 w-4" />
          {t('common.refresh')}
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t('admin.dashboard.stats.totalUsers')}
            value={stats.totalUsers}
            icon={Icons.users}
          />
          <StatCard
            title={t('admin.dashboard.stats.totalCompanies')}
            value={stats.totalCompanies}
            icon={Icons.building}
          />
          <StatCard
            title={t('admin.dashboard.stats.activeRides')}
            value={stats.activeRides}
            icon={Icons.car}
          />
          <StatCard
            title={t('admin.dashboard.stats.pendingApprovals')}
            value={stats.pendingApprovals}
            icon={Icons.clock}
          />
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            {t('admin.dashboard.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="users">
            {t('admin.dashboard.tabs.users')}
          </TabsTrigger>
          <TabsTrigger value="companies">
            {t('admin.dashboard.tabs.companies')}
          </TabsTrigger>
          <TabsTrigger value="drivers">
            {t('admin.dashboard.tabs.drivers')}
          </TabsTrigger>
          <TabsTrigger value="rides">
            {t('admin.dashboard.tabs.rides')}
          </TabsTrigger>
          <TabsTrigger value="revenue">
            {t('admin.dashboard.tabs.revenue')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.dashboard.recentActivity')}</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity?.recentUsers?.map((user: any) => (
                <div key={user.id} className="flex items-center space-x-4 py-2">
                  <Icons.user className="h-6 w-6" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge>{user.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          {revenue && (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.dashboard.revenueOverTime')}</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={Object.entries(revenue.monthlyRevenue).map(([month, value]) => ({
                    name: new Date(2024, Number(month)).toLocaleString('default', { month: 'short' }),
                    value: value as number
                  }))}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.dashboard.userManagement')}</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { accessorKey: 'name', header: t('common.name') },
                  { accessorKey: 'email', header: t('common.email') },
                  { accessorKey: 'role', header: t('common.role') },
                  { accessorKey: 'status', header: t('common.status') },
                  {
                    id: 'actions',
                    cell: ({ row }) => (
                      <Button
                        variant="outline"
                        onClick={() => {/* Handle user action */}}
                      >
                        {t('common.manage')}
                      </Button>
                    ),
                  },
                ]}
                data={recentActivity?.recentUsers || []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar content for other tabs */}
      </Tabs>
    </div>
  );
}
