import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSignupStore } from '@/services/signupService';
import { toast } from 'sonner';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 characters'),
  address: z.string().min(10, 'Please provide a complete address'),
  fleetSize: z.number().min(1, 'Fleet size must be at least 1'),
  operatingRegions: z.array(z.string()).min(1, 'Select at least one region'),
  businessLicense: z.string().min(5, 'Please provide valid business license information'),
  insuranceInfo: z.string().min(5, 'Please provide valid insurance information'),
});

const regions = [
  'Luxembourg City',
  'Esch-sur-Alzette',
  'Differdange',
  'Dudelange',
  'Ettelbruck',
  'Diekirch',
];

export function CompanySignupForm() {
  const addRequest = useSignupStore((state) => state.addRequest);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operatingRegions: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      addRequest(values);
      toast.success('Signup request submitted successfully');
      toast.info('Please wait for admin approval. You will receive credentials via email.');
      form.reset();
    } catch (error) {
      toast.error('Failed to submit signup request');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Company Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fleetSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fleet Size</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operatingRegions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Regions</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange([...field.value, value])}
                        value={field.value[field.value.length - 1]}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select regions" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((region) => (
                          <div
                            key={region}
                            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center"
                          >
                            {region}
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(field.value.filter((r) => r !== region))
                              }
                              className="ml-2 text-primary hover:text-primary/80"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business License</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insuranceInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Information</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Registration
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
