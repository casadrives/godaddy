import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  CreditCard,
  Users,
  ChevronRight,
  Banknote,
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const VEHICLE_TYPES = [
  {
    id: 'economy',
    name: 'Economy',
    price: '3.65',
    description: 'Affordable rides for everyday trips',
    capacity: '4',
    examples: 'Toyota Corolla, Honda Civic',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    price: '4.50',
    description: 'More space and comfort',
    capacity: '4',
    examples: 'Volkswagen Passat, Audi A4',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '5.75',
    description: 'Luxury vehicles for special occasions',
    capacity: '4',
    examples: 'Mercedes E-Class, BMW 5 Series',
  },
  {
    id: 'van',
    name: 'Van',
    price: '6.50',
    description: 'Perfect for groups or lots of luggage',
    capacity: '6-8',
    examples: 'Mercedes V-Class, VW Transporter',
  },
];

const PAYMENT_METHODS = [
  {
    id: 'cash',
    name: 'Cash',
    description: 'Pay with cash to the driver',
    icon: Banknote,
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: CreditCard,
  },
];

export function BookingFlow() {
  const [step, setStep] = React.useState(1);
  const [booking, setBooking] = React.useState({
    pickup: '',
    destination: '',
    date: new Date(),
    time: '',
    passengers: '1',
    vehicleType: 'economy',
    paymentMethod: 'card',
    notes: '',
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const LocationStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pickup">Pickup Location</Label>
        <div className="relative">
          <MapPin className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="pickup"
            placeholder="Enter pickup address"
            value={booking.pickup}
            onChange={(e) => setBooking({ ...booking, pickup: e.target.value })}
            className="pl-8"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <div className="relative">
          <MapPin className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="destination"
            placeholder="Enter destination address"
            value={booking.destination}
            onChange={(e) => setBooking({ ...booking, destination: e.target.value })}
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );

  const DateTimeStep = () => (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !booking.date && 'text-muted-foreground'
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {booking.date ? (
                format(booking.date, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={booking.date}
              onSelect={(date) => date && setBooking({ ...booking, date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-2">
        <Label>Time</Label>
        <Select
          value={booking.time}
          onValueChange={(time) => setBooking({ ...booking, time })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              return (
                <SelectItem key={hour} value={`${hour}:00`}>
                  {`${hour}:00`}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const VehicleStep = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        {VEHICLE_TYPES.map((vehicle) => (
          <Card
            key={vehicle.id}
            className={cn(
              'p-4 cursor-pointer transition-colors',
              booking.vehicleType === vehicle.id
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            )}
            onClick={() => setBooking({ ...booking, vehicleType: vehicle.id })}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {vehicle.description}
                </p>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  Up to {vehicle.capacity} passengers
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {vehicle.examples}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">€{vehicle.price}/km</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const PaymentStep = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        {PAYMENT_METHODS.map((method) => (
          <Card
            key={method.id}
            className={cn(
              'p-4 cursor-pointer transition-colors',
              booking.paymentMethod === method.id
                ? 'border-primary bg-primary/5'
                : 'hover:border-primary/50'
            )}
            onClick={() => setBooking({ ...booking, paymentMethod: method.id })}
          >
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {React.createElement(method.icon, { className: 'h-6 w-6' })}
              </div>
              <div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const ConfirmationStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Trip Summary</h3>
        <Card className="p-4 space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium">{booking.pickup}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-destructive mt-1" />
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium">{booking.destination}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Date</p>
            <p className="font-medium">{format(booking.date, 'PPP')}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Time</p>
            <p className="font-medium">{booking.time}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Vehicle</p>
            <p className="font-medium">
              {VEHICLE_TYPES.find((v) => v.id === booking.vehicleType)?.name}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Payment Method</p>
            <p className="font-medium">
              {PAYMENT_METHODS.find((m) => m.id === booking.paymentMethod)?.name}
            </p>
          </div>
        </Card>

        <Card className="p-4 bg-primary/5 space-y-2">
          <div className="flex justify-between">
            <p>Estimated Price</p>
            <p className="font-semibold">€45-55</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Final price may vary based on actual distance and time
          </p>
        </Card>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex justify-between">
          {['Location', 'Date & Time', 'Vehicle', 'Payment', 'Confirm'].map((label, index) => (
            <div
              key={label}
              className={cn(
                'flex items-center',
                index < step && 'text-primary',
                index === step - 1 && 'font-semibold'
              )}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full border flex items-center justify-center mr-2',
                  index < step && 'bg-primary text-white border-primary',
                  index === step - 1 && 'border-primary'
                )}
              >
                {index + 1}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {step === 1 && <LocationStep />}
          {step === 2 && <DateTimeStep />}
          {step === 3 && <VehicleStep />}
          {step === 4 && <PaymentStep />}
          {step === 5 && <ConfirmationStep />}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            onClick={step === 5 ? () => console.log('Booking confirmed:', booking) : handleNext}
          >
            {step === 5 ? 'Confirm Booking' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
