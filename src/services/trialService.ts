import { PRICING } from '../config/pricing';
import type { Account, TrialStatus } from '../config/pricing';

export class TrialService {
  /**
   * Initialize trial period for a new account
   */
  static initializeTrial(): TrialStatus {
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setMonth(trialEndDate.getMonth() + PRICING.TRIAL.DURATION_MONTHS);

    return {
      isInTrial: true,
      trialStartDate: now,
      trialEndDate,
      daysRemaining: Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    };
  }

  /**
   * Check if an account is in trial period
   */
  static isInTrial(account: Account & { trial: TrialStatus }): boolean {
    if (!account.trial) return false;
    
    const now = new Date();
    return now <= account.trial.trialEndDate;
  }

  /**
   * Calculate remaining trial days
   */
  static getRemainingDays(account: Account & { trial: TrialStatus }): number {
    if (!this.isInTrial(account)) return 0;
    
    const now = new Date();
    return Math.max(0, Math.ceil(
      (account.trial.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    ));
  }

  /**
   * Get applicable fees based on trial status
   */
  static getApplicableFees(account: Account & { trial: TrialStatus }) {
    const isInTrial = this.isInTrial(account);
    
    if (account.type === 'company') {
      return {
        taxiMonthlyFee: isInTrial ? 0 : PRICING.COMPANY.TAXI_MONTHLY_FEE,
        commissionPercentage: isInTrial ? 0 : PRICING.COMPANY.RIDE_COMMISSION_PERCENTAGE
      };
    } else {
      return {
        monthlyFee: isInTrial ? 0 : PRICING.INDIVIDUAL_DRIVER.MONTHLY_FEE,
        commissionPercentage: isInTrial ? 0 : PRICING.INDIVIDUAL_DRIVER.COMMISSION_PERCENTAGE
      };
    }
  }

  /**
   * Get trial status notification message
   */
  static getTrialNotification(account: Account & { trial: TrialStatus }): string {
    if (!this.isInTrial(account)) {
      return 'Trial period has ended.';
    }

    const daysRemaining = this.getRemainingDays(account);
    if (daysRemaining <= 7) {
      return `Trial ending soon! ${daysRemaining} days remaining.`;
    }
    
    return `Trial active - ${daysRemaining} days remaining.`;
  }
}
