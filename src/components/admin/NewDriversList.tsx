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

interface DriverApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  submissionDate: Date;
  vehicleType: string;
  documents: {
    driverLicense: boolean;
    insurance: boolean;
    criminalRecord: boolean;
    vehicleRegistration: boolean;
  };
  languages: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export function NewDriversList() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<DriverApplication[]>([
    // Mock data
    {
      id: 'DRV-001',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+352 691 234 567',
      submissionDate: new Date('2024-01-15'),
      vehicleType: 'Sedan',
      documents: {
        driverLicense: true,
        insurance: true,
        criminalRecord: true,
        vehicleRegistration: true,
      },
      languages: ['French', 'English', 'Luxembourgish'],
      status: 'pending',
    },
    // Add more mock applications as needed
  ]);

  const handleApprove = async (applicationId: string) => {
    // TODO: Implement approval logic with backend
    setApplications(apps =>
      apps.map(app =>
        app.id === applicationId ? { ...app, status: 'approved' } : app
      )
    );
  };

  const handleReject = async (applicationId: string) => {
    // TODO: Implement rejection logic with backend
    setApplications(apps =>
      apps.map(app =>
        app.id === applicationId ? { ...app, status: 'rejected' } : app
      )
    );
  };

  const getStatusBadge = (status: DriverApplication['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={styles[status]}>
        {t(`admin.driverStatus.${status}`)}
      </Badge>
    );
  };

  const getDocumentStatus = (isVerified: boolean) => {
    return isVerified ? (
      <Badge className="bg-green-100 text-green-800">
        {t('admin.documents.verified')}
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        {t('admin.documents.missing')}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.newDrivers.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.newDrivers.id')}</TableHead>
              <TableHead>{t('admin.newDrivers.name')}</TableHead>
              <TableHead>{t('admin.newDrivers.contact')}</TableHead>
              <TableHead>{t('admin.newDrivers.documents')}</TableHead>
              <TableHead>{t('admin.newDrivers.languages')}</TableHead>
              <TableHead>{t('admin.newDrivers.status')}</TableHead>
              <TableHead>{t('admin.newDrivers.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.name}</div>
                    <div className="text-sm text-gray-500">
                      {application.vehicleType}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{application.email}</div>
                    <div className="text-sm text-gray-500">
                      {application.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {Object.entries(application.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-sm">
                          {t(`admin.documents.${key}`)}:
                        </span>
                        {getDocumentStatus(value)}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {application.languages.map((lang) => (
                      <Badge key={lang} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>
                  {application.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(application.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {t('admin.actions.approve')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(application.id)}
                      >
                        {t('admin.actions.reject')}
                      </Button>
                    </div>
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
