import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaxiCompany } from '@/services/taxiCompanyService';

const taxiCompanySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  website: z.string().optional(),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  fleetSize: z.number().min(1, 'Fleet size must be at least 1'),
  active: z.boolean(),
  operatingHours: z.string().min(1, 'Operating hours are required'),
  regions: z.array(z.string()).min(1, 'At least one region is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  foundedYear: z.number().min(1900).max(new Date().getFullYear()),
  insuranceStatus: z.enum(['valid', 'expired', 'pending']),
  lastInspectionDate: z.string().min(1, 'Last inspection date is required'),
  averageResponseTime: z.number().min(0),
});

type TaxiCompanyFormData = z.infer<typeof taxiCompanySchema>;

interface TaxiCompanyFormProps {
  initialData?: TaxiCompany;
  onSubmit: (data: TaxiCompanyFormData) => void;
  onCancel: () => void;
}

const regions = [
  'Luxembourg City',
  'Esch-sur-Alzette',
  'Differdange',
  'Dudelange',
  'Kirchberg',
  'Findel Airport',
  'Gare',
  'Bonnevoie',
  'Limpertsberg',
  'Belair',
  'Strassen',
  'Bertrange',
  'Gasperich',
  'Cloche d\'Or',
  'Howald',
];

export function TaxiCompanyForm({
  initialData,
  onSubmit,
  onCancel,
}: TaxiCompanyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaxiCompanyFormData>({
    resolver: zodResolver(taxiCompanySchema),
    defaultValues: initialData || {
      name: '',
      phone: '',
      website: '',
      email: '',
      address: '',
      fleetSize: 1,
      active: true,
      operatingHours: '24/7',
      regions: [],
      licenseNumber: '',
      foundedYear: new Date().getFullYear(),
      insuranceStatus: 'valid',
      lastInspectionDate: new Date().toISOString().split('T')[0],
      averageResponseTime: 5,
    },
  });

  const selectedRegions = watch('regions');

  const handleRegionChange = (region: string) => {
    const currentRegions = selectedRegions || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter((r) => r !== region)
      : [...currentRegions, region];
    setValue('regions', newRegions, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...register('phone')} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <Input id="website" {...register('website')} />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="fleetSize">Fleet Size</Label>
            <Input
              id="fleetSize"
              type="number"
              {...register('fleetSize', { valueAsNumber: true })}
            />
            {errors.fleetSize && (
              <p className="text-sm text-red-500">{errors.fleetSize.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input id="licenseNumber" {...register('licenseNumber')} />
            {errors.licenseNumber && (
              <p className="text-sm text-red-500">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="foundedYear">Founded Year</Label>
            <Input
              id="foundedYear"
              type="number"
              {...register('foundedYear', { valueAsNumber: true })}
            />
            {errors.foundedYear && (
              <p className="text-sm text-red-500">{errors.foundedYear.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="insuranceStatus">Insurance Status</Label>
            <Select
              onValueChange={(value) =>
                setValue('insuranceStatus', value as 'valid' | 'expired' | 'pending')
              }
              defaultValue={initialData?.insuranceStatus || 'valid'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select insurance status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            {errors.insuranceStatus && (
              <p className="text-sm text-red-500">
                {errors.insuranceStatus.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastInspectionDate">Last Inspection Date</Label>
            <Input
              id="lastInspectionDate"
              type="date"
              {...register('lastInspectionDate')}
            />
            {errors.lastInspectionDate && (
              <p className="text-sm text-red-500">
                {errors.lastInspectionDate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label>Operating Regions</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selectedRegions?.includes(region)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              }`}
              onClick={() => handleRegionChange(region)}
            >
              {region}
            </button>
          ))}
        </div>
        {errors.regions && (
          <p className="text-sm text-red-500 mt-1">{errors.regions.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="averageResponseTime">Average Response Time (minutes)</Label>
        <Input
          id="averageResponseTime"
          type="number"
          {...register('averageResponseTime', { valueAsNumber: true })}
        />
        {errors.averageResponseTime && (
          <p className="text-sm text-red-500">
            {errors.averageResponseTime.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={watch('active')}
          onCheckedChange={(checked) => setValue('active', checked)}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Company
        </Button>
      </div>
    </form>
  );
}
