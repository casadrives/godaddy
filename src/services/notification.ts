export interface Notification {
  id: string;
  type: 'subscription_due' | 'subscription_overdue' | 'payment_success' | 'payment_failed' | 'earnings_report';
  title: string;
  message: string;
  created: Date;
  read: boolean;
  data?: Record<string, any>;
}

// Mock notification service - replace with real implementation
export const notificationService = {
  async sendSubscriptionDueNotification(driverId: string, daysUntilDue: number): Promise<Notification> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: `notif_${Math.random().toString(36).substr(2, 9)}`,
      type: 'subscription_due',
      title: 'Subscription Payment Due',
      message: `Your monthly subscription payment is due in ${daysUntilDue} days.`,
      created: new Date(),
      read: false,
      data: {
        driverId,
        daysUntilDue,
      },
    };
  },

  async sendSubscriptionOverdueNotification(driverId: string, daysOverdue: number): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: `notif_${Math.random().toString(36).substr(2, 9)}`,
      type: 'subscription_overdue',
      title: 'Subscription Payment Overdue',
      message: `Your subscription payment is ${daysOverdue} days overdue. Please update your payment to continue using the platform.`,
      created: new Date(),
      read: false,
      data: {
        driverId,
        daysOverdue,
      },
    };
  },

  async sendPaymentSuccessNotification(driverId: string, amount: number): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: `notif_${Math.random().toString(36).substr(2, 9)}`,
      type: 'payment_success',
      title: 'Payment Successful',
      message: `Your subscription payment of €${amount.toFixed(2)} was successful.`,
      created: new Date(),
      read: false,
      data: {
        driverId,
        amount,
      },
    };
  },

  async sendPaymentFailedNotification(driverId: string, amount: number, reason: string): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: `notif_${Math.random().toString(36).substr(2, 9)}`,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `Your subscription payment of €${amount.toFixed(2)} failed. Reason: ${reason}`,
      created: new Date(),
      read: false,
      data: {
        driverId,
        amount,
        reason,
      },
    };
  },

  async sendEarningsReportNotification(driverId: string, period: { start: Date; end: Date }, earnings: number): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: `notif_${Math.random().toString(36).substr(2, 9)}`,
      type: 'earnings_report',
      title: 'Monthly Earnings Report',
      message: `Your earnings report for ${period.start.toLocaleDateString()} to ${period.end.toLocaleDateString()} is ready. Total earnings: €${earnings.toFixed(2)}`,
      created: new Date(),
      read: false,
      data: {
        driverId,
        period,
        earnings,
      },
    };
  },

  async getNotifications(driverId: string): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock notifications
    return [
      {
        id: 'notif_1',
        type: 'subscription_due',
        title: 'Subscription Payment Due',
        message: 'Your monthly subscription payment is due in 5 days.',
        created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: 'notif_2',
        type: 'earnings_report',
        title: 'Monthly Earnings Report',
        message: 'Your earnings report for the last month is ready.',
        created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ];
  },

  async markAsRead(notificationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock implementation
  },
};
