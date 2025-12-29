'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProductList from '@/components/products/ProductList';
import ProductForm from '@/components/products/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = () => {
    setShowAddModal(false);
    fetchProducts();
  };

  const canCreate = user?.role === 'admin' || user?.role === 'manager';

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Products', href: '/products' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          {canCreate && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      <ProductList 
        products={products} 
        loading={loading} 
        onRefresh={fetchProducts}
      />

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSuccess={handleProductAdded} />
        </DialogContent>
      </Dialog>
    </div>
  );
}