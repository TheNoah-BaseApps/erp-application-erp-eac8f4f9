'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomerForm from './CustomerForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Mail, Phone, MapPin, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CustomerDetails({ customer, onUpdate }) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [user, setUser] = useState(null);

  useState(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const canEdit = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'sales_rep';
  const canDelete = user?.role === 'admin';

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Customer deleted successfully');
        router.push('/customers');
      } else {
        toast.error(data.error || 'Failed to delete customer');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error('Failed to delete customer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{customer.customer_name}</h2>
          <p className="text-gray-600">Customer Code: {customer.customer_code}</p>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <Button onClick={() => setShowEditModal(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {canDelete && (
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Contact Person</p>
                <p className="font-medium">{customer.contact_person || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Telephone</p>
                <p className="font-medium">{customer.telephone_number}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{customer.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{customer.address || 'N/A'}</p>
                <p className="text-sm text-gray-600">
                  {[customer.city_or_district, customer.region_or_state, customer.country]
                    .filter(Boolean)
                    .join(', ') || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Sales Representative</p>
              <p className="font-medium">{customer.sales_rep || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Terms</p>
              <p className="font-medium">
                {customer.payment_terms_limit ? `${customer.payment_terms_limit} days` : 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Balance Risk Limit</p>
              <p className="font-medium">
                {customer.balance_risk_limit ? formatCurrency(customer.balance_risk_limit) : 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium">{customer.created_by_name || 'Unknown'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">{formatDate(customer.created_at)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            customer={customer} 
            onSuccess={() => {
              setShowEditModal(false);
              onUpdate();
            }} 
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}