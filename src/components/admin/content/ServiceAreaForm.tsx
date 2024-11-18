import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapDraw } from './MapDraw';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const serviceAreaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  baseRate: z.number().min(0, 'Base rate must be positive'),
  active: z.boolean(),
  coordinates: z.array(z.tuple([z.number(), z.number()])).min(3, 'Must define an area with at least 3 points'),
});

type ServiceAreaFormData = z.infer<typeof serviceAreaSchema>;

interface ServiceAreaFormProps {
  initialData?: ServiceAreaFormData;
  onSubmit: (data: ServiceAreaFormData) => void;
  onCancel: () => void;
}

export function ServiceAreaForm({ initialData, onSubmit, onCancel }: ServiceAreaFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceAreaFormData>({
    resolver: zodResolver(serviceAreaSchema),
    defaultValues: initialData || {
      name: '',
      baseRate: 0,
      active: true,
      coordinates: [],
    },
  });

  const coordinates = watch('coordinates');

  const handleCoordinatesChange = (newCoordinates: [number, number][]) => {
    setValue('coordinates', newCoordinates, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter service area name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="baseRate">Base Rate ($)</Label>
        <Input
          id="baseRate"
          type="number"
          step="0.01"
          {...register('baseRate', { valueAsNumber: true })}
          placeholder="Enter base rate"
        />
        {errors.baseRate && (
          <p className="text-sm text-red-500">{errors.baseRate.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          {...register('active')}
          defaultChecked={initialData?.active}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      <div className="space-y-2">
        <Label>Service Area Boundary</Label>
        <div className="h-[400px] border rounded-md overflow-hidden">
          <MapDraw
            initialCoordinates={coordinates}
            onChange={handleCoordinatesChange}
          />
        </div>
        {errors.coordinates && (
          <p className="text-sm text-red-500">{errors.coordinates.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Service Area
        </Button>
      </div>
    </form>
  );
}
