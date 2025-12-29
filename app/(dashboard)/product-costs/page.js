'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CostList from '@/components/product-costs/CostList';
import CostForm from '@/components/product-costs/CostForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toast } from 'sonner';

export default function ProductCostsPage() {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/product-costs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCosts(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch product costs');
      }
    } catch (err) {
      console.error('Error fetching costs:', err);
      toast.error('Failed to load product costs');
    } finally {
      setLoading(false);
    }
  };

  const handleCostAdded = () => {
    setShowAddModal(false);
    fetchCosts();
  };

  const canCreate = user?.role === 'admin' || user?.role === 'manager';

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Product Costs', href: '/product-costs' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-3xl font-bold">Product Costs</h1>
            <p className="text-gray-600 mt-1">Track historical and current product costs</p>
          </div>
          {canCreate && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Cost Entry
            </Button>
          )}
        </div>
      </div>

      <CostList 
        costs={costs} 
        loading={loading} 
        onRefresh={fetchCosts}
      />

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Cost Entry</DialogTitle>
          </DialogHeader>
          <CostForm onSuccess={handleCostAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}