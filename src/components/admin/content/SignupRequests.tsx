import React, { useState } from 'react';
import { useSignupStore, SignupRequest } from '@/services/signupService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { generatePassword } from '@/lib/utils';

interface CredentialsFormData {
  email: string;
  password: string;
}

export function SignupRequests() {
  const [selectedRequest, setSelectedRequest] = useState<SignupRequest | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [credentials, setCredentials] = useState<CredentialsFormData>({
    email: '',
    password: '',
  });

  const { requests, approveRequest, rejectRequest } = useSignupStore();

  const handleApprove = (request: SignupRequest) => {
    setSelectedRequest(request);
    setCredentials({
      email: request.email,
      password: generatePassword(),
    });
    setIsApprovalDialogOpen(true);
  };

  const handleConfirmApproval = () => {
    if (selectedRequest) {
      approveRequest(selectedRequest.id, credentials);
      toast.success('Company registration approved');
      toast.info('Credentials will be sent to the company email');
      setIsApprovalDialogOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleReject = (request: SignupRequest) => {
    if (window.confirm('Are you sure you want to reject this registration request?')) {
      rejectRequest(request.id);
      toast.success('Company registration rejected');
    }
  };

  const getStatusBadge = (status: SignupRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50">Rejected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registration Requests</CardTitle>
          <CardDescription>
            Review and manage taxi company registration requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fleet Size</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.companyName}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.fleetSize} vehicles</TableCell>
                  <TableCell>
                    {new Date(request.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 hover:bg-green-100"
                          onClick={() => handleApprove(request)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 hover:bg-red-100"
                          onClick={() => handleReject(request)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Company Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Login Email</Label>
              <Input
                id="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="password">Generated Password</Label>
              <div className="flex space-x-2">
                <Input
                  id="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    setCredentials({
                      ...credentials,
                      password: generatePassword(),
                    })
                  }
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApproval}>Approve & Send Credentials</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
