import { PAYMENT_LINKS, PAYMENT_CONFIG } from '../config/pricing';
import type { Account, TrialStatus } from '../config/pricing';

type PaymentMethod = typeof PAYMENT_CONFIG.SUPPORTED_METHODS[number];

export class PaymentService {
  /**
   * Generate PayPal payment URL
   */
  private static generatePayPalUrl(amount: number, description: string): string {
    const baseUrl = 'https://www.paypal.com/paypalme/';
    const email = PAYMENT_CONFIG.PAYPAL.EMAIL.split('@')[0]; // Get username part
    const params = new URLSearchParams({
      amount: amount.toString(),
      currency: PAYMENT_CONFIG.PAYPAL.CURRENCY,
      description: description,
    });
    return `${baseUrl}${email}?${params.toString()}`;
  }

  /**
   * Get subscription amount based on account type
   */
  private static getSubscriptionAmount(account: Account): number {
    if (account.type === 'individual_driver') {
      return 30; // €30 monthly fee
    } else if (account.type === 'company') {
      const numberOfTaxis = account.companyDetails?.numberOfTaxis || 0;
      return numberOfTaxis * 10; // €10 per taxi
    }
    return 0;
  }

  /**
   * Get payment description based on account type
   */
  private static getPaymentDescription(account: Account): string {
    if (account.type === 'individual_driver') {
      return 'CasaDrives Driver Monthly Subscription';
    } else if (account.type === 'company') {
      const numberOfTaxis = account.companyDetails?.numberOfTaxis || 0;
      return `CasaDrives Company Subscription - ${numberOfTaxis} taxi${numberOfTaxis !== 1 ? 's' : ''}`;
    }
    return 'CasaDrives Subscription';
  }

  /**
   * Get payment URL based on method and account type
   */
  static getPaymentUrl(account: Account, method: PaymentMethod): string {
    if (method === 'paypal') {
      const amount = this.getSubscriptionAmount(account);
      const description = this.getPaymentDescription(account);
      return this.generatePayPalUrl(amount, description);
    } else if (method === 'sumup' && account.type === 'individual_driver') {
      return PAYMENT_LINKS.DRIVER.SUMUP;
    }
    return '';
  }

  /**
   * Get available payment methods for account type
   */
  static getAvailablePaymentMethods(account: Account): PaymentMethod[] {
    if (account.type === 'individual_driver') {
      return ['paypal', 'sumup'];
    }
    return ['paypal'];
  }

  /**
   * Redirect to payment page
   */
  static redirectToPayment(account: Account & { trial: TrialStatus }, method: PaymentMethod): void {
    const paymentUrl = this.getPaymentUrl(account, method);
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }

  /**
   * Get subscription status message
   */
  static getSubscriptionMessage(account: Account & { trial: TrialStatus }): string {
    if (account.trial.isInTrial) {
      const daysLeft = Math.ceil((account.trial.trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      if (account.type === 'individual_driver') {
        return `Trial Period: ${daysLeft} days remaining. After trial, subscription will be €30/month.`;
      } else if (account.type === 'company') {
        const taxiCount = account.companyDetails?.numberOfTaxis || 0;
        const monthlyFee = taxiCount * 10;
        return `Trial Period: ${daysLeft} days remaining. After trial, subscription will be €${monthlyFee}/month for ${taxiCount} taxi${taxiCount !== 1 ? 's' : ''}.`;
      }
    }

    if (account.type === 'individual_driver') {
      return 'Monthly Subscription: €30/month';
    } else if (account.type === 'company') {
      const taxiCount = account.companyDetails?.numberOfTaxis || 0;
      const monthlyFee = taxiCount * 10;
      return `Monthly Subscription: €${monthlyFee}/month for ${taxiCount} taxi${taxiCount !== 1 ? 's' : ''}.`;
    }

    return '';
  }

  /**
   * Get payment button text based on account status
   */
  static getPaymentButtonText(account: Account & { trial: TrialStatus }): string {
    if (account.trial.isInTrial) {
      return 'Set Up Payment for After Trial';
    }
    return 'Pay Monthly Subscription';
  }
}
