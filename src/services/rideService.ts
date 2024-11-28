import { BehaviorSubject } from 'rxjs';

export interface Location {
  address: string;
  coordinates: [number, number];
}

export interface Vehicle {
  make: string;
  model: string;
  licensePlate: string;
  color: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: Vehicle;
  location: [number, number];
  isAvailable: boolean;
}

export interface RideRequest {
  pickup: Location;
  dropoff: Location;
  passengers: number;
  notes?: string;
  scheduledTime?: Date;
  paymentMethod: 'cash' | 'card';
}

export interface RideOffer {
  driver: Driver;
  estimatedTime: number;
  distance: number;
  price: number;
  surge: number;
}

export interface ActiveRide {
  id: string;
  driver: Driver;
  pickup: Location;
  dropoff: Location;
  status: 'accepted' | 'arriving' | 'picked_up' | 'in_progress' | 'completed' | 'cancelled' | 'scheduled';
  estimatedTime: number;
  distance: number;
  price: number;
  startTime?: Date;
  endTime?: Date;
}

class RideService {
  private static instance: RideService;
  private currentRideSubject = new BehaviorSubject<ActiveRide | null>(null);
  private rideHistorySubject = new BehaviorSubject<ActiveRide[]>([]);

  private constructor() {
    // Load any saved ride data from localStorage
    const savedRide = localStorage.getItem('currentRide');
    if (savedRide) {
      this.currentRideSubject.next(JSON.parse(savedRide));
    }
  }

  public static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  public get currentRide() {
    return this.currentRideSubject.value;
  }

  public get currentRideObservable() {
    return this.currentRideSubject.asObservable();
  }

  public get rideHistory() {
    return this.rideHistorySubject.value;
  }

  public async searchDrivers(request: RideRequest): Promise<RideOffer[]> {
    // In a real app, this would make an API call to find nearby drivers
    // For now, we'll simulate some offers
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    const baseDrivers: Driver[] = [
      {
        id: '1',
        name: 'John Smith',
        phone: '+352 691 123 456',
        rating: 4.8,
        vehicle: {
          make: 'Mercedes',
          model: 'E-Class',
          licensePlate: 'LU 1234',
          color: 'Black'
        },
        location: [6.13, 49.61],
        isAvailable: true
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        phone: '+352 691 234 567',
        rating: 4.9,
        vehicle: {
          make: 'BMW',
          model: '5 Series',
          licensePlate: 'LU 5678',
          color: 'Silver'
        },
        location: [6.14, 49.62],
        isAvailable: true
      },
      {
        id: '3',
        name: 'Michael Brown',
        phone: '+352 691 345 678',
        rating: 4.7,
        vehicle: {
          make: 'Audi',
          model: 'A6',
          licensePlate: 'LU 9012',
          color: 'Blue'
        },
        location: [6.12, 49.60],
        isAvailable: true
      }
    ];

    const currentHour = new Date().getHours();
    const isSurgeTime = currentHour >= 7 && currentHour <= 9 || currentHour >= 16 && currentHour <= 19;
    const surgeMultiplier = isSurgeTime ? 1.5 : 1;

    return baseDrivers
      .filter(driver => driver.isAvailable)
      .map(driver => ({
        driver,
        estimatedTime: Math.floor(Math.random() * 10) + 5,
        distance: Math.round((Math.random() * 5 + 2) * 10) / 10,
        price: Math.round((Math.random() * 20 + 15) * surgeMultiplier),
        surge: surgeMultiplier
      }));
  }

  public async requestRide(request: RideRequest, selectedOffer: RideOffer): Promise<ActiveRide> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

    const ride: ActiveRide = {
      id: Math.random().toString(36).substring(7),
      driver: selectedOffer.driver,
      pickup: request.pickup,
      dropoff: request.dropoff,
      status: 'accepted',
      estimatedTime: selectedOffer.estimatedTime,
      distance: selectedOffer.distance,
      price: selectedOffer.price,
      startTime: new Date()
    };

    this.currentRideSubject.next(ride);
    localStorage.setItem('currentRide', JSON.stringify(ride));

    return ride;
  }

  public async updateRideStatus(status: ActiveRide['status']) {
    const currentRide = this.currentRideSubject.value;
    if (!currentRide) return;

    const updatedRide = {
      ...currentRide,
      status,
      endTime: status === 'completed' ? new Date() : currentRide.endTime
    };

    this.currentRideSubject.next(updatedRide);
    localStorage.setItem('currentRide', JSON.stringify(updatedRide));

    if (status === 'completed' || status === 'cancelled') {
      this.rideHistorySubject.next([...this.rideHistory, updatedRide]);
      localStorage.removeItem('currentRide');
      this.currentRideSubject.next(null);
    }
  }

  public async cancelRide(reason: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    await this.updateRideStatus('cancelled');
  }

  public async getRideHistory(): Promise<ActiveRide[]> {
    // In a real app, this would fetch from an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.rideHistory;
  }

  public async scheduleRide(request: RideRequest): Promise<ActiveRide> {
    const scheduledRide = {
      ...request,
      id: `ride-${Date.now()}`,
      status: 'scheduled',
      estimatedTime: 0,
      distance: 0,
      price: 0,
      driver: null,
    };
    this.rideHistorySubject.next([...this.rideHistorySubject.value, scheduledRide]);
    return scheduledRide;
  }
}

export const rideService = RideService.getInstance();
