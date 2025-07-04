import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Package2, Edit, Eye, Loader2 } from 'lucide-react'; // Added Loader2 for spinners
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import AddProductModal from '@/components/AddProductModal'; // Modal for adding products
import EditProductModal from '@/components/EditProductModal'; // Modal for editing products
import ViewProductModal from '@/components/ViewProductModal'; // Modal for viewing product details
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'; // Shadcn UI AlertDialog for confirmation

/**
 * @typedef {object} ProductData
 * @property {string} id - Unique identifier for the product.
 * @property {string} name - Name of the product.
 * @property {string} category - Category the product belongs to.
 * @property {number} price - Price of the product.
 * @property {number} stock_quantity - Current stock quantity.
 * @property {boolean} in_stock - Boolean indicating if the product is in stock.
 * @property {string} created_at - Timestamp of product creation.
 * // Add other relevant product properties as needed (e.g., description, image_url, vendor_id)
 */
interface ProductData {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  in_stock: boolean;
  created_at: string;
  // Add any other fields that your 'products' table might have
  description?: string;
  image_url?: string;
  vendor_id?: string;
}

/**
 * `AdminProducts` component provides an administrative interface for managing products.
 * It allows viewing, adding, editing, and deleting products in the marketplace.
 * It uses `react-query` for data fetching and mutations, and Shadcn UI for styling.
 */
const AdminProducts = () => {
  const { toast } = useToast(); // Hook for displaying toast notifications
  const queryClient = useQueryClient(); // Client for invalidating react-query caches

  // State for controlling modal visibility and selected product for edit/view
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [showEditProduct, setShowEditProduct] = useState<boolean>(false);
  const [showViewProduct, setShowViewProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);

  /**
   * Fetches all products from the 'products' table.
   * Uses `react-query` for caching and state management.
   */
  const { data: products, isLoading: productsLoading } = useQuery<ProductData[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }); // Order by creation date

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      return data;
    }
  });

  /**
   * Mutation for deleting a product.
   * On success, invalidates the 'admin-products' query to refetch data and shows a toast.
   * On error, shows a destructive toast.
   */
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId); // Delete product by ID
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] }); // Refetch products
      toast({ title: "Product deleted successfully", variant: "success" }); // Show success toast
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting product",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  });

  /**
   * Opens the delete confirmation dialog for a specific product.
   * @param {string} productId - The ID of the product to be deleted.
   */
  const confirmDeleteProduct = (productId: string) => {
    setProductToDeleteId(productId);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Executes the delete mutation after user confirmation.
   */
  const handleDeleteProduct = () => {
    if (productToDeleteId) {
      deleteProductMutation.mutate(productToDeleteId);
      setIsDeleteDialogOpen(false); // Close the dialog
      setProductToDeleteId(null); // Reset the ID
    }
  };

  /**
   * Callback function for when a new product is successfully added.
   * Invalidates the query to refresh the list and closes the modal.
   */
  const handleProductAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setShowAddProduct(false);
  };

  /**
   * Handles click on the "Edit" button for a product.
   * Sets the selected product and opens the Edit Product modal.
   * @param {ProductData} product - The product data to be edited.
   */
  const handleEditClick = (product: ProductData) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  /**
   * Handles click on the "View" button for a product.
   * Sets the selected product and opens the View Product modal.
   * @param {ProductData} product - The product data to be viewed.
   */
  const handleViewClick = (product: ProductData) => {
    setSelectedProduct(product);
    setShowViewProduct(true);
  };

  /**
   * Callback function for when a product is successfully edited.
   * Invalidates the query to refresh the list and closes the modal.
   */
  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setShowEditProduct(false);
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 p-4 md:p-6 animate-fade-in">
          {/* Page Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Package2 className="h-9 w-9" />
                Product Management
              </h1>
              <p className="text-blue-100 mt-2 text-lg">Oversee and manage your marketplace product catalog.</p>
            </div>
            <Button
              onClick={() => setShowAddProduct(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3 text-base rounded-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Product
            </Button>
          </div>

          {/* Products Table Card */}
          <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-6 bg-white border-b border-gray-100">
              <div>
                <CardTitle className="text-2xl font-semibold text-gray-800">Available Products</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  A comprehensive list of all products in your marketplace.
                </CardDescription>
              </div>
              {/* Optional: Add search/filter components here if needed */}
            </CardHeader>
            <CardContent className="p-0">
              {productsLoading ? (
                // Full-page loading spinner for initial data fetch
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                  <span className="text-lg font-medium">Loading products...</span>
                  <p className="text-sm mt-1">Fetching the latest product data.</p>
                </div>
              ) : products && products.length > 0 ? (
                // Display table if products are available
                <div className="overflow-x-auto">
                  <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200">
                      {products.map((product, index) => (
                        <TableRow
                          key={product.id}
                          className="hover:bg-blue-50 transition-colors duration-200 ease-in-out"
                          style={{ animationDelay: `${index * 0.05}s` }} // Subtle staggered animation
                        >
                          <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1 rounded-full">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                            KSH {Number(product.price).toLocaleString()}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant={product.in_stock ? 'default' : 'destructive'}
                              className={product.in_stock ? 'bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1 rounded-full' : 'bg-red-100 text-red-800 border-red-200 text-xs px-2 py-1 rounded-full'}
                            >
                              {product.in_stock ? `${product.stock_quantity} in stock` : 'Out of stock'}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {/* View Product Button */}
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleViewClick(product)}
                                className="h-9 w-9 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-full"
                                aria-label={`View ${product.name}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {/* Edit Product Button */}
                              <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => handleEditClick(product)}
                                className="h-9 w-9 text-yellow-600 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300 transition-all duration-200 rounded-full"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {/* Delete Product Button */}
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => confirmDeleteProduct(product.id)}
                                disabled={deleteProductMutation.isPending} // Disable during deletion
                                className="h-9 w-9 bg-red-500 hover:bg-red-600 text-white transition-all duration-200 rounded-full"
                                aria-label={`Delete ${product.name}`}
                              >
                                {deleteProductMutation.isPending && productToDeleteId === product.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                // Empty state when no products are found after loading
                <div className="text-center py-16 text-gray-500">
                  <Package2 className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <p className="text-xl font-semibold">No products found</p>
                  <p className="text-md mt-2">Start by adding your first product to the marketplace!</p>
                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          open={showAddProduct}
          onOpenChange={setShowAddProduct}
          onSuccess={handleProductAdded}
        />

        {/* Edit Product Modal */}
        {selectedProduct && (
          <EditProductModal
            open={showEditProduct}
            product={selectedProduct}
            onOpenChange={setShowEditProduct}
            onSuccess={handleEditSuccess}
          />
        )}

        {/* View Product Modal */}
        {selectedProduct && (
          <ViewProductModal
            open={showViewProduct}
            product={selectedProduct}
            onOpenChange={setShowViewProduct}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you absolutely sure you want to delete this product? This action cannot be undone and will permanently remove the product from your catalog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteProductMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                disabled={deleteProductMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteProductMutation.isPending ? (
                  <span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</span>
                ) : (
                  'Delete Product'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminProducts;

