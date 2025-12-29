'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CustomerList from '@/components/customers/CustomerList';
import CustomerForm from '@/components/customers/CustomerForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toast } from 'sonner';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/customers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch customers');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerAdded = () => {
    setShowAddModal(false);
    fetchCustomers();
  };

  const canCreate = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'sales_rep';

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Customers', href: '/customers' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-gray-600 mt-1">Manage customer relationships</p>
          </div>
          {canCreate && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          )}
        </div>
      </div>

      <CustomerList 
        customers={customers} 
        loading={loading} 
        onRefresh={fetchCustomers}
      />

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerForm onSuccess={handleCustomerAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}