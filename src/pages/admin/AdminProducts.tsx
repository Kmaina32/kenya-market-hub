
import React, { useState } from 'react';
import { StandardAdminLayout } from '@/components/admin/StandardAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DeleteButton, ViewButton, EditButton } from '@/components/ui/action-buttons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminProducts } from '@/hooks/useAdminData';
import { Plus, Package } from 'lucide-react';

const AdminProducts = () => {
  const { products, isLoading, deleteProduct, addProduct } = useAdminProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock_quantity: '',
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) return;
    
    await addProduct({
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock_quantity: parseInt(newProduct.stock_quantity) || 0,
      in_stock: parseInt(newProduct.stock_quantity) > 0,
    });
    
    setIsAddDialogOpen(false);
    setNewProduct({ name: '', category: '', price: '', stock_quantity: '' });
  };

  const handleViewProduct = (productId: string) => {
    console.log('View product:', productId);
  };

  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId);
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock_quantity), 0);
  const lowStockCount = products.filter(p => p.stock_quantity < 10).length;

  const stats = [
    { title: 'Total Products', value: products.length, change: '+3%', trend: 'up' as const },
    { title: 'In Stock', value: products.filter(p => p.in_stock).length, change: '-2%', trend: 'down' as const },
    { title: 'Low Stock', value: lowStockCount, change: '+1', trend: 'up' as const },
    { title: 'Total Value', value: `KSH ${totalValue.toLocaleString()}`, change: '+15%', trend: 'up' as const },
  ];

  return (
    <StandardAdminLayout
      title="Product Management"
      description="Manage your marketplace products"
      stats={stats}
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price (KSH)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock_quantity}
                  onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                  placeholder="Enter stock quantity"
                />
              </div>
              <Button onClick={handleAddProduct} className="w-full">
                Add Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
      loading={isLoading}
    >
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>KSH {product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>
                    <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ViewButton onClick={() => handleViewProduct(product.id)} />
                      <EditButton onClick={() => handleEditProduct(product.id)} />
                      <DeleteButton onClick={() => deleteProduct(product.id)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </StandardAdminLayout>
  );
};

export default AdminProducts;
