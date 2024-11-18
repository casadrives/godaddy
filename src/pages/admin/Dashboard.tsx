import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewDriversList } from '@/components/admin/NewDriversList';
import { CompanySubscriptions } from '@/components/admin/CompanySubscriptions';
import { useTranslation } from '@/hooks/useTranslation';

export function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('admin.dashboard.title')}
      </h1>

      <Tabs defaultValue="drivers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="drivers">
            {t('admin.dashboard.tabs.newDrivers')}
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            {t('admin.dashboard.tabs.subscriptions')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
          <NewDriversList />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <CompanySubscriptions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
