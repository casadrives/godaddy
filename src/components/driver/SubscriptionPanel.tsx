import React, { useState } from 'react';
import { PaymentService } from '../../services/paymentService';
import { TrialService } from '../../services/trialService';
import { PAYMENT_CONFIG } from '../../config/pricing';
import type { Account, TrialStatus } from '../../config/pricing';

interface SubscriptionPanelProps {
  account: Account & { trial: TrialStatus };
}

export const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({ account }) => {
  const [selectedMethod, setSelectedMethod] = useState<typeof PAYMENT_CONFIG.SUPPORTED_METHODS[number]>('paypal');

  const handlePaymentClick = () => {
    PaymentService.redirectToPayment(account, selectedMethod);
  };

  const isInTrial = TrialService.isInTrial(account);
  const subscriptionMessage = PaymentService.getSubscriptionMessage(account);
  const buttonText = PaymentService.getPaymentButtonText(account);
  const trialNotification = TrialService.getTrialNotification(account);
  const availablePaymentMethods = PaymentService.getAvailablePaymentMethods(account);

  return (
    <div className="subscription-panel">
      <div className="subscription-header">
        <h2>{account.type === 'company' ? 'Company' : 'Driver'} Subscription</h2>
        {isInTrial && (
          <div className="trial-badge">
            Trial Active
          </div>
        )}
      </div>

      <div className="subscription-info">
        <p>{subscriptionMessage}</p>
        {isInTrial && (
          <div className="trial-notification">
            {trialNotification}
          </div>
        )}
      </div>

      <div className="subscription-features">
        <h3>Subscription Includes:</h3>
        <ul>
          {account.type === 'individual_driver' ? (
            <>
              <li>✓ Unlimited ride requests</li>
              <li>✓ Priority customer support</li>
              <li>✓ Real-time earnings tracking</li>
              <li>✓ Professional driver profile</li>
            </>
          ) : (
            <>
              <li>✓ Multiple taxi management</li>
              <li>✓ Company dashboard</li>
              <li>✓ Fleet analytics</li>
              <li>✓ Priority support</li>
            </>
          )}
        </ul>
      </div>

      <div className="payment-section">
        <div className="payment-methods">
          <h4>Select Payment Method:</h4>
          <div className="payment-options">
            {availablePaymentMethods.map((method) => (
              <label key={method} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={(e) => setSelectedMethod(e.target.value as typeof selectedMethod)}
                />
                <span className="payment-logo">
                  {method === 'paypal' ? (
                    <img src="/images/paypal-logo.png" alt="PayPal" />
                  ) : (
                    <img src="/images/sumup-logo.png" alt="SumUp" />
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        <p className="price-info">
          <span className="price">
            {account.type === 'company' 
              ? `€${(account.companyDetails?.numberOfTaxis || 0) * 10}`
              : '€30'
            }
          </span>
          <span className="period">/month</span>
        </p>

        <button 
          className="payment-button"
          onClick={handlePaymentClick}
        >
          {buttonText}
        </button>

        <p className="payment-provider">
          Secure payment powered by {selectedMethod === 'paypal' ? 'PayPal' : 'SumUp'}
        </p>
      </div>

      <style jsx>{`
        .subscription-panel {
          padding: 24px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .subscription-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .trial-badge {
          background: #4CAF50;
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
        }

        .subscription-info {
          margin-bottom: 24px;
        }

        .trial-notification {
          background: #FFF3E0;
          color: #E65100;
          padding: 12px;
          border-radius: 8px;
          margin-top: 12px;
        }

        .subscription-features {
          margin-bottom: 24px;
        }

        .subscription-features ul {
          list-style: none;
          padding: 0;
        }

        .subscription-features li {
          margin: 8px 0;
          color: #444;
        }

        .payment-section {
          text-align: center;
          padding: 24px;
          background: #F5F5F5;
          border-radius: 8px;
        }

        .payment-methods {
          margin-bottom: 24px;
        }

        .payment-options {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 12px;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .payment-option:hover {
          border-color: #2196F3;
        }

        .payment-option input {
          margin: 0;
        }

        .payment-logo img {
          height: 24px;
          width: auto;
        }

        .price-info {
          margin: 24px 0;
        }

        .price {
          font-size: 32px;
          font-weight: bold;
          color: #2196F3;
        }

        .period {
          color: #666;
        }

        .payment-button {
          background: #2196F3;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .payment-button:hover {
          background: #1976D2;
        }

        .payment-provider {
          margin-top: 12px;
          font-size: 14px;
          color: #666;
        }
      `}</style>
    </div>
  );
};
