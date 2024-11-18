import { CompanyBilling, PRICING, TaxiRegistration } from '@/config/pricing';

export class BillingService {
  async calculateMonthlyBill(
    companyId: string,
    month: string // YYYY-MM format
  ): Promise<CompanyBilling> {
    // TODO: Replace with actual database queries
    const activeTaxis = await this.getActiveTaxis(companyId);
    const monthlyRides = await this.getMonthlyRides(companyId, month);
    
    const taxiFees = activeTaxis.length * PRICING.TAXI_MONTHLY_FEE;
    const totalRideRevenue = monthlyRides.reduce((sum, ride) => sum + ride.fare, 0);
    const commissionAmount = (totalRideRevenue * PRICING.RIDE_COMMISSION_PERCENTAGE) / 100;
    
    const dueDate = this.calculateDueDate(month);
    
    return {
      companyId,
      month,
      activeTaxis: activeTaxis.length,
      taxiFees,
      totalRides: monthlyRides.length,
      totalRideRevenue,
      commissionAmount,
      totalDue: taxiFees + commissionAmount,
      status: 'pending',
      dueDate,
    };
  }

  private async getActiveTaxis(companyId: string): Promise<TaxiRegistration[]> {
    // Mock implementation
    return [
      {
        id: 'TAXI-001',
        companyId,
        licensePlate: 'LU1234',
        vehicleType: 'Sedan',
        registrationDate: new Date(),
        status: 'active',
      },
      // Add more mock taxis as needed
    ];
  }

  private async getMonthlyRides(
    companyId: string,
    month: string
  ): Promise<Array<{ id: string; fare: number }>> {
    // Mock implementation
    return [
      { id: 'RIDE-001', fare: 25.50 },
      { id: 'RIDE-002', fare: 32.75 },
      // Add more mock rides as needed
    ];
  }

  private calculateDueDate(month: string): Date {
    // Due date is the 10th of the following month
    const [year, monthStr] = month.split('-');
    const nextMonth = new Date(parseInt(year), parseInt(monthStr), 1);
    nextMonth.setDate(10);
    return nextMonth;
  }

  async registerTaxi(taxi: Omit<TaxiRegistration, 'id' | 'registrationDate' | 'status'>): Promise<TaxiRegistration> {
    // TODO: Implement actual database insertion
    return {
      ...taxi,
      id: `TAXI-${Math.random().toString(36).substr(2, 9)}`,
      registrationDate: new Date(),
      status: 'active',
    };
  }

  async deactivateTaxi(taxiId: string): Promise<void> {
    // TODO: Implement actual database update
    console.log(`Deactivating taxi ${taxiId}`);
  }

  async generateInvoice(billing: CompanyBilling): Promise<string> {
    // TODO: Implement actual invoice generation
    return `
Invoice for ${billing.companyId}
Period: ${billing.month}
---------------------------------
Active Taxis: ${billing.activeTaxis}
Taxi Fees: €${billing.taxiFees.toFixed(2)}

Total Rides: ${billing.totalRides}
Total Ride Revenue: €${billing.totalRideRevenue.toFixed(2)}
Commission (${PRICING.RIDE_COMMISSION_PERCENTAGE}%): €${billing.commissionAmount.toFixed(2)}

Total Due: €${billing.totalDue.toFixed(2)}
Due Date: ${billing.dueDate.toLocaleDateString()}
    `;
  }

  async getBillingHistory(
    companyId: string,
    startMonth: string,
    endMonth: string
  ): Promise<CompanyBilling[]> {
    // TODO: Implement actual database query
    return [
      await this.calculateMonthlyBill(companyId, startMonth),
      // Add more mock billing records as needed
    ];
  }

  async markAsPaid(companyId: string, month: string): Promise<void> {
    // TODO: Implement actual database update
    console.log(`Marking billing for ${companyId} - ${month} as paid`);
  }

  async getTaxiList(companyId: string): Promise<TaxiRegistration[]> {
    // TODO: Implement actual database query
    return this.getActiveTaxis(companyId);
  }
}
