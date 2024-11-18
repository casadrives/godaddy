import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface SignupRequest {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  fleetSize: number;
  operatingRegions: string[];
  businessLicense: string;
  insuranceInfo: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  credentials?: {
    email: string;
    password: string;
  };
}

interface SignupState {
  requests: SignupRequest[];
  addRequest: (request: Omit<SignupRequest, 'id' | 'status' | 'submittedAt'>) => void;
  approveRequest: (id: string, credentials: { email: string; password: string }) => void;
  rejectRequest: (id: string) => void;
  getRequest: (id: string) => SignupRequest | undefined;
}

// In a real app, this would be handled by a backend
export const useSignupStore = create<SignupState>((set, get) => ({
  requests: [],
  addRequest: (request) => {
    set((state) => ({
      requests: [
        ...state.requests,
        {
          ...request,
          id: uuidv4(),
          status: 'pending',
          submittedAt: new Date(),
        },
      ],
    }));
  },
  approveRequest: (id, credentials) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'approved',
              reviewedAt: new Date(),
              credentials,
            }
          : request
      ),
    }));
  },
  rejectRequest: (id) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'rejected',
              reviewedAt: new Date(),
            }
          : request
      ),
    }));
  },
  getRequest: (id) => {
    return get().requests.find((request) => request.id === id);
  },
}));
