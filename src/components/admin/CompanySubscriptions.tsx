import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { CompanyTaxis } from './CompanyTaxis';

interface CompanySubscription {
  id: string;
  companyName: string;
  registrationNumber: string;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'pending' | 'suspended';
  startDate: Date;
  endDate: Date;
  billingInfo: {
    method: string;
    cycle: 'monthly' | 'yearly';
    amount: number;
  };
  features: {
    maxDrivers: number;
    prioritySupport: boolean;
    customBranding: boolean;
    analytics: boolean;
    api: boolean;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  numberOfTaxis: number;
}

export function CompanySubscriptions() {
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>([
    // Mock data
    {
      id: 'SUB-001',
      companyName: 'Luxembourg Transport Co.',
      registrationNumber: 'LUX20240001',
      plan: 'premium',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      billingInfo: {
        method: 'SEPA Direct Debit',
        cycle: 'monthly',
        amount: 499.99,
      },
      features: {
        maxDrivers: 50,
        prioritySupport: true,
        customBranding: true,
        analytics: true,
        api: true,
      },
      contactPerson: {
        name: 'Marie Weber',
        email: 'marie.weber@luxtransport.lu',
        phone: '+352 691 123 456',
      },
      numberOfTaxis: 5,
    },
  ]);

  const handleSuspend = async (subscriptionId: string) => {
    setSubscriptions(subs =>
      subs.map(sub =>
        sub.id === subscriptionId ? { ...sub, status: 'suspended' } : sub
      )
    );
  };

  const handleActivate = async (subscriptionId: string) => {
    setSubscriptions(subs =>
      subs.map(sub =>
        sub.id === subscriptionId ? { ...sub, status: 'active' } : sub
      )
    );
  };

  const handleViewTaxis = (subscriptionId: string) => {
    setSelectedCompany(subscriptionId);
  };

  const getStatusBadge = (status: CompanySubscription['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={styles[status]}>
        {t(`admin.subscriptionStatus.${status}`)}
      </Badge>
    );
  };

  const getPlanBadge = (plan: CompanySubscription['plan']) => {
    const styles = {
      basic: 'bg-gray-100 text-gray-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-blue-100 text-blue-800',
    };

    return (
      <Badge className={styles[plan]}>
        {t(`admin.subscriptionPlan.${plan}`)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.companySubscriptions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.companySubscriptions.company')}</TableHead>
                <TableHead>{t('admin.companySubscriptions.plan')}</TableHead>
                <TableHead>{t('admin.companySubscriptions.billing')}</TableHead>
                <TableHead>{t('admin.companySubscriptions.taxis')}</TableHead>
                <TableHead>{t('admin.companySubscriptions.contact')}</TableHead>
                <TableHead>{t('admin.companySubscriptions.status')}</TableHead>
                <TableHead>{t('admin.companySubscriptions.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subscription.companyName}</div>
                      <div className="text-sm text-gray-500">
                        {subscription.registrationNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getPlanBadge(subscription.plan)}
                      <div className="text-sm text-gray-500">
                        {t('admin.subscriptionDates', {
                          start: subscription.startDate.toLocaleDateString(),
                          end: subscription.endDate.toLocaleDateString(),
                        })}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>€{subscription.billingInfo.amount}/month</div>
                      <div className="text-sm text-gray-500">
                        {subscription.billingInfo.method}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div>{subscription.numberOfTaxis} taxis</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewTaxis(subscription.id)}
                      >
                        {t('admin.companySubscriptions.viewTaxis')}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{subscription.contactPerson.name}</div>
                      <div className="text-sm text-gray-500">
                        {subscription.contactPerson.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.contactPerson.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {subscription.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleSuspend(subscription.id)}
                        >
                          {t('admin.actions.suspend')}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleActivate(subscription.id)}
                        >
                          {t('admin.actions.activate')}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCompany && (
        <CompanyTaxis companyId={selectedCompany} />
      )}
    </div>
  );
}
