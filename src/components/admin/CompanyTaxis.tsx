import React, { useState, useEffect } from 'react';
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
import { BillingService } from '@/services/billing';
import { TaxiRegistration } from '@/config/pricing';

interface CompanyTaxisProps {
  companyId: string;
}

export function CompanyTaxis({ companyId }: CompanyTaxisProps) {
  const { t } = useTranslation();
  const [taxis, setTaxis] = useState<TaxiRegistration[]>([]);
  const billingService = new BillingService();

  useEffect(() => {
    loadTaxis();
  }, [companyId]);

  const loadTaxis = async () => {
    const taxiList = await billingService.getTaxiList(companyId);
    setTaxis(taxiList);
  };

  const handleDeactivate = async (taxiId: string) => {
    await billingService.deactivateTaxi(taxiId);
    await loadTaxis();
  };

  const handleRegister = async () => {
    // TODO: Implement taxi registration form
    const newTaxi = await billingService.registerTaxi({
      companyId,
      licensePlate: 'LU-NEW',
      vehicleType: 'Sedan',
    });
    setTaxis([...taxis, newTaxi]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('admin.companyTaxis.title')}</CardTitle>
        <Button onClick={handleRegister}>
          {t('admin.companyTaxis.registerNew')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-gray-500">
            {t('admin.companyTaxis.monthlyFeeInfo', { count: taxis.length })}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.companyTaxis.id')}</TableHead>
              <TableHead>{t('admin.companyTaxis.licensePlate')}</TableHead>
              <TableHead>{t('admin.companyTaxis.vehicleType')}</TableHead>
              <TableHead>{t('admin.companyTaxis.registrationDate')}</TableHead>
              <TableHead>{t('admin.companyTaxis.status')}</TableHead>
              <TableHead>{t('admin.companyTaxis.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxis.map((taxi) => (
              <TableRow key={taxi.id}>
                <TableCell>{taxi.id}</TableCell>
                <TableCell>{taxi.licensePlate}</TableCell>
                <TableCell>{taxi.vehicleType}</TableCell>
                <TableCell>
                  {taxi.registrationDate.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      taxi.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {t(`admin.companyTaxis.status.${taxi.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {taxi.status === 'active' && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeactivate(taxi.id)}
                    >
                      {t('admin.companyTaxis.deactivate')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
