import { supabase } from '@/lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import type { Database } from '@/types/supabase';

type Payment = Database['public']['Tables']['payments']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Constants for fee calculations
const PLATFORM_FEE_PERCENTAGE = 0.15; // 15% platform fee

export const financeService = {
  // Get driver earnings
  async getDriverEarnings(driverId: string, options: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
  } = {}) {
    try {
      const { startDate, endDate, groupBy = 'day' } = options;

      let query = supabase
        .from('rides')
        .select(`
          id,
          created_at,
          fare_amount,
          driver_earnings,
          company_commission,
          platform_fee,
          payment_status,
          distance,
          duration
        `)
        .eq('driver_id', driverId)
        .eq('status', 'completed')
        .eq('payment_status', 'paid');

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data: rides, error } = await query;

      if (error) throw error;

      // Group earnings by specified interval
      const groupedEarnings = rides.reduce((acc: any, ride) => {
        let key;
        const date = new Date(ride.created_at);
        
        switch (groupBy) {
          case 'week':
            key = this.getWeekNumber(date);
            break;
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          default: // day
            key = date.toISOString().split('T')[0];
        }

        if (!acc[key]) {
          acc[key] = {
            total: 0,
            rides: 0,
            distance: 0,
            duration: 0
          };
        }

        acc[key].total += ride.driver_earnings || 0;
        acc[key].rides += 1;
        acc[key].distance += ride.distance || 0;
        acc[key].duration += ride.duration || 0;

        return acc;
      }, {});

      return {
        earnings: groupedEarnings,
        summary: {
          total: rides.reduce((sum, ride) => sum + (ride.driver_earnings || 0), 0),
          rides: rides.length,
          totalDistance: rides.reduce((sum, ride) => sum + (ride.distance || 0), 0),
          totalDuration: rides.reduce((sum, ride) => sum + (ride.duration || 0), 0)
        }
      };
    } catch (error) {
      console.error('Error getting driver earnings:', error);
      throw error;
    }
  },

  // Get company financials
  async getCompanyFinancials(companyId: string, options: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
  } = {}) {
    try {
      const { startDate, endDate, groupBy = 'day' } = options;

      let query = supabase
        .from('rides')
        .select(`
          id,
          created_at,
          fare_amount,
          driver_earnings,
          company_commission,
          platform_fee,
          payment_status,
          driver:drivers(id, users(first_name, last_name))
        `)
        .eq('company_id', companyId)
        .eq('status', 'completed');

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data: rides, error } = await query;

      if (error) throw error;

      // Calculate financials
      const financials = rides.reduce((acc: any, ride) => {
        const date = new Date(ride.created_at);
        let key;

        switch (groupBy) {
          case 'week':
            key = this.getWeekNumber(date);
            break;
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          default:
            key = date.toISOString().split('T')[0];
        }

        if (!acc[key]) {
          acc[key] = {
            revenue: 0,
            driverPayouts: 0,
            platformFees: 0,
            netEarnings: 0,
            rides: 0
          };
        }

        acc[key].revenue += ride.fare_amount || 0;
        acc[key].driverPayouts += ride.driver_earnings || 0;
        acc[key].platformFees += ride.platform_fee || 0;
        acc[key].netEarnings += ride.company_commission || 0;
        acc[key].rides += 1;

        return acc;
      }, {});

      return {
        financials,
        summary: {
          totalRevenue: rides.reduce((sum, ride) => sum + (ride.fare_amount || 0), 0),
          totalDriverPayouts: rides.reduce((sum, ride) => sum + (ride.driver_earnings || 0), 0),
          totalPlatformFees: rides.reduce((sum, ride) => sum + (ride.platform_fee || 0), 0),
          totalNetEarnings: rides.reduce((sum, ride) => sum + (ride.company_commission || 0), 0),
          totalRides: rides.length
        }
      };
    } catch (error) {
      console.error('Error getting company financials:', error);
      throw error;
    }
  },

  // Calculate ride fees
  calculateRideFees(fareAmount: number) {
    const platformFee = fareAmount * PLATFORM_FEE_PERCENTAGE;
    const driverEarnings = fareAmount - platformFee;

    return {
      fareAmount,
      platformFee,
      driverEarnings,
    };
  },

  // Process payment for ride
  async processRidePayment(rideId: string) {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      // Get ride details
      const { data: ride, error: rideError } = await supabase
        .from('rides')
        .select(`
          *,
          user:users!inner(stripe_customer_id),
          driver:drivers!inner(stripe_account_id)
        `)
        .eq('id', rideId)
        .single();

      if (rideError) throw rideError;

      // Calculate fees
      const { platformFee, driverEarnings } = this.calculateRideFees(ride.fare_amount);

      // Create payment intent with fee calculations
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: ride.fare_amount,
          currency: 'eur',
          customer: ride.user.stripe_customer_id,
          transfer_data: {
            destination: ride.driver.stripe_account_id,
            amount: Math.round(driverEarnings * 100), // Convert to cents for Stripe
          },
          application_fee_amount: Math.round(platformFee * 100), // Platform fee in cents
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret);

      if (error) throw error;

      // Update ride payment status and fee details
      const { error: updateError } = await supabase
        .from('rides')
        .update({
          payment_status: 'paid',
          payment_intent_id: paymentIntent?.id,
          paid_at: new Date().toISOString(),
          platform_fee: platformFee,
          driver_earnings: driverEarnings,
        })
        .eq('id', rideId);

      if (updateError) throw updateError;

      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Get payment methods
  async getPaymentMethods(userId: string) {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const response = await fetch(`/api/payment-methods/${user.stripe_customer_id}`);
      const paymentMethods = await response.json();

      return paymentMethods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  },

  // Add payment method
  async addPaymentMethod(userId: string, paymentMethodId: string) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const response = await fetch('/api/add-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.stripe_customer_id,
          paymentMethodId
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  // Get transaction history
  async getTransactionHistory(userId: string, options: {
    type?: 'payment' | 'payout';
    status?: 'pending' | 'completed' | 'failed';
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options.type) {
        query = query.eq('type', options.type);
      }
      if (options.status) {
        query = query.eq('status', options.status);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { transactions: data, count };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  },

  // Request payout
  async requestPayout(userId: string, amount: number) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('stripe_account_id, available_balance')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      if (!user.stripe_account_id) {
        throw new Error('Stripe account not connected');
      }

      if ((user.available_balance || 0) < amount) {
        throw new Error('Insufficient balance');
      }

      const response = await fetch('/api/create-payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: user.stripe_account_id,
          amount
        }),
      });

      const payout = await response.json();

      // Record transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'payout',
          amount,
          status: 'pending',
          stripe_payout_id: payout.id
        });

      if (transactionError) throw transactionError;

      return payout;
    } catch (error) {
      console.error('Error requesting payout:', error);
      throw error;
    }
  },

  // Helper function to get week number
  private getWeekNumber(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }
};
