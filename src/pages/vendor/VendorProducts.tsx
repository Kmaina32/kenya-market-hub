
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Filter
} from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import AddProductModal from '@/components/AddProductModal';
import EditProductModal from '@/components/EditProductModal';

const VendorProducts = () => {
  const { user } = useAuth();
  const { data: allProducts = [], isLoading, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products for current vendor
  const vendorProducts = allProducts.filter(product => product.vendor_id === user?.id);
  
  const filteredProducts = vendorProducts.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct.mutate(productId);
    }
  };

  const handleModalSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Products</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No products match your search' : 'No products yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Start by adding your first product to get your store up and running'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 relative overflow-hidden">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-orange-600">
                      KSh {product.price.toLocaleString()}
                    </span>
                    <div className="text-sm text-gray-600">
                      Stock: {product.stock_quantity || 0}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span>{product.views_count || 0} views</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleModalSuccess}
      />
      
      <EditProductModal
        open={isEditModalOpen}
        product={selectedProduct}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default VendorProducts;
