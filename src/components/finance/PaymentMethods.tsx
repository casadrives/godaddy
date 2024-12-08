import React, { useState, useEffect } from 'react';
import { financeService } from '@/services/financeService';
import {
  Box,
  Card,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  CreditCard as CardIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentMethodsProps {
  userId: string;
}

const AddPaymentMethodForm: React.FC<{
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ userId, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentMethod) {
        await financeService.addPaymentMethod(userId, paymentMethod.id);
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      setError(error instanceof Error ? error.message : 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 2 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Add Card
        </Button>
      </DialogActions>
    </form>
  );
};

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ userId }) => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, [userId]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await financeService.getPaymentMethods(userId);
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      setError('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setAddDialogOpen(false);
    loadPaymentMethods();
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    // Implementation for deleting payment method
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" display="flex" alignItems="center">
            <CardIcon sx={{ mr: 1 }} />
            Payment Methods
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Payment Method
          </Button>
        </Box>

        <List>
          {paymentMethods.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No payment methods found"
                secondary="Add a payment method to get started"
              />
            </ListItem>
          ) : (
            paymentMethods.map((method) => (
              <ListItem key={method.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <CardIcon />
                      •••• {method.card.last4}
                      {method.card.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={`${method.card.brand} - Expires ${method.card.exp_month}/${method.card.exp_year}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>

        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogContent>
            <Elements stripe={stripePromise}>
              <AddPaymentMethodForm
                userId={userId}
                onSuccess={handleAddSuccess}
                onCancel={() => setAddDialogOpen(false)}
              />
            </Elements>
          </DialogContent>
        </Dialog>
      </Box>
    </Card>
  );
};
