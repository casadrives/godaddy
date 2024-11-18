import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Euro,
  Shield,
  Banknote,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'cash';
  last4?: string;
  expiry?: string;
  brand?: string;
  isDefault: boolean;
}

export function PaymentMethods() {
  const [methods, setMethods] = React.useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'credit',
      last4: '4242',
      expiry: '12/25',
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'debit',
      last4: '8888',
      expiry: '09/24',
      brand: 'Mastercard',
      isDefault: false,
    },
    {
      id: '3',
      type: 'cash',
      isDefault: false,
    },
  ]);

  const AddPaymentDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup defaultValue="credit" className="grid grid-cols-2 gap-4">
            <Label
              htmlFor="credit"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="credit" id="credit" className="sr-only" />
              <CreditCard className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Credit Card</span>
            </Label>
            <Label
              htmlFor="debit"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem value="debit" id="debit" className="sr-only" />
              <Euro className="mb-3 h-6 w-6" />
              <span className="text-sm font-medium">Debit Card</span>
            </Label>
          </RadioGroup>
          <div className="grid gap-2">
            <Label htmlFor="number">Card Number</Label>
            <Input id="number" placeholder="1234 5678 9012 3456" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input id="name" placeholder="Name as shown on card" />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Add Card</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Payment Methods</h2>
          <AddPaymentDialog />
        </div>

        <div className="grid gap-4">
          {/* Cash Payment Option */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Banknote className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">Cash Payment</h3>
                    {methods.find(m => m.type === 'cash')?.isDefault && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pay with cash directly to the driver
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!methods.find(m => m.type === 'cash')?.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setMethods(methods.map(m => ({
                        ...m,
                        isDefault: m.type === 'cash'
                      })));
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Set Default
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Card Payment Methods */}
          {methods.filter(method => method.type !== 'cash').map((method) => (
            <Card key={method.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">
                        {method.brand} •••• {method.last4}
                      </h3>
                      {method.isDefault && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiry}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg flex items-start space-x-3">
          <Shield className="h-5 w-5 text-primary mt-1" />
          <div>
            <h4 className="font-semibold">Secure Payment Processing</h4>
            <p className="text-sm text-muted-foreground">
              Your payment information is encrypted and securely stored. We never store your full card details on our servers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
