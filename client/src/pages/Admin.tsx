import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';

const ADMIN_PASSWORD = 'admin@123';

interface Product {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  inStock: boolean;
  stockQuantity: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: Record<string, string>;
  createdAt?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  contactName: string;
  contactPhone: string;
  address?: Record<string, string>;
  totalAmount: number;
  status: string;
  createdAt?: string;
  items: OrderItem[];
}

interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  stockQuantity: number;
}

interface OrderRowProps {
  order: Order;
  expandedOrder: string | null;
  toggleOrderDetails: (id: string) => void;
  handleMarkDelivered: (id: string) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, expandedOrder, toggleOrderDetails, handleMarkDelivered }) => (
  <>
    <tr key={`order-row-${order._id}`}>
      <td className="p-3">
        <Button
          variant="link"
          onClick={() => toggleOrderDetails(order._id)}
          className="text-primary hover:underline"
        >
          {order._id}
        </Button>
      </td>
      <td className="p-3">{order.contactName}</td>
      <td className="p-3">₹{order.totalAmount}</td>
      <td className="p-3">
        {order.status === 'Delivered' ? (
          <span className="text-green-600 font-medium">{order.status}</span>
        ) : (
          <span className="text-yellow-600 font-medium">{order.status}</span>
        )}
      </td>
      <td className="p-3">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
      <td className="p-3">
        {order.status !== 'Delivered' && (
          <Button
            variant="link"
            className="text-green-600 hover:underline"
            onClick={() => handleMarkDelivered(order._id)}
          >
            Mark as Delivered
          </Button>
        )}
      </td>
    </tr>
    {expandedOrder === order._id && (
      <tr key={`order-details-${order._id}`}>
        <td colSpan={6} className="p-3 bg-muted/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-foreground">Items</h4>
              <ul className="list-disc ml-6 text-muted-foreground">
                {order.items.map((item, index) => (
                  <li key={`item-${item.productId}-${index}`}>
                    {item.name} x {item.quantity} (₹{item.price})
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Address</h4>
              <p className="text-muted-foreground">{order.contactPhone}</p>
              <p className="text-muted-foreground">
                {order.address ? Object.values(order.address).filter(Boolean).join(', ') : 'No address provided'}
              </p>
            </div>
          </div>
        </td>
      </tr>
    )}
  </>
);

export default function AdminPage() {
  const [password, setPassword] = useState<string>('');
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Product form state
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    inStock: true,
    stockQuantity: ''
  });
  const [productMsg, setProductMsg] = useState<string>('');
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);

  // User list state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [usersError, setUsersError] = useState<string>('');
  const [showUsersModal, setShowUsersModal] = useState<boolean>(false);
  const [usersPage, setUsersPage] = useState<number>(1);
  const usersPerPage = 5;

  // Products state
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [productsError, setProductsError] = useState<string>('');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string>('');
  const [ordersPage, setOrdersPage] = useState<number>(1);
  const ordersPerPage = 5;
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Auth token
  const token = localStorage.getItem('token') || '';

  // Fetch users and orders
  useEffect(() => {
    if (authenticated) {
      setUsersLoading(true);
      fetch('https://sevipure-server.onrender.com/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setUsers((data.users || []) as User[]);
          setUsersLoading(false);
        })
        .catch(() => {
          setUsersError('Failed to load users');
          setUsersLoading(false);
        });

      setOrdersLoading(true);
      fetch('https://sevipure-server.onrender.com/api/order', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const sortedOrders = (data.orders || []).sort((a: Order, b: Order) => 
            new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
          );
          setOrders(sortedOrders as Order[]);
          setOrdersLoading(false);
        })
        .catch(() => {
          setOrdersError('Failed to load orders');
          setOrdersLoading(false);
        });
    }
  }, [authenticated, token]);

  // Fetch products
  useEffect(() => {
    if (authenticated) {
      setProductsLoading(true);
      fetch('https://sevipure-server.onrender.com/api/products')
        .then(res => res.json())
        .then(data => {
          setProducts((data.products || []) as ProductResponse[]);
          setProductsLoading(false);
        })
        .catch(() => {
          setProductsError('Failed to load products');
          setProductsLoading(false);
        });
    }
  }, [authenticated, productMsg]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleProductChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'inStock' ? value === 'true' : value }));
  };

  const handleProductSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProductMsg('');
    setProductLoading(true);
    try {
      const res = await fetch('https://sevipure-server.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
          stockQuantity: Number(product.stockQuantity),
          inStock: product.inStock
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProductMsg('Product added successfully!');
        setProduct({ name: '', description: '', price: '', image: '', category: '', inStock: true, stockQuantity: '' });
        setProducts(prev => [...prev, data.product as ProductResponse]);
        setShowProductModal(false);
      } else {
        setProductMsg(data.message || 'Failed to add product');
      }
    } catch {
      setProductMsg('Failed to add product');
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await fetch(`https://sevipure-server.onrender.com/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      setProductsError('Failed to delete product');
    }
  };

  const handleRestockProduct = async (id: string) => {
    const qty = prompt('Enter new stock quantity:');
    if (!qty || isNaN(Number(qty))) return;
    try {
      await fetch(`https://sevipure-server.onrender.com/api/products/${id}/quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stockQuantity: Number(qty) })
      });
      setProductMsg('Product restocked!');
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stockQuantity: Number(qty) } : p));
    } catch {
      setProductMsg('Failed to restock product');
    }
  };

  const handleMarkDelivered = async (id: string) => {
    if (!window.confirm('Mark this order as delivered?')) return;
    try {
      const res = await fetch(`https://sevipure-server.onrender.com/api/order/${id}/delivered`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'Delivered' } : o));
        setOrdersError('');
      } else if (res.status === 404) {
        setOrdersError(`Order ${id} not found. Please verify the order ID.`);
      } else {
        setOrdersError(data.message || 'Failed to update order status');
      }
    } catch (error) {
      setOrdersError('Failed to update order status. Check server connection.');
    }
  };

  const toggleOrderDetails = (id: string) => {
    setExpandedOrder(prev => (prev === id ? null : id));
  };

  const paginate = <T,>(data: T[], page: number, perPage: number): T[] => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const totalProfit = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalItemsSold = orders.reduce((acc, o) => acc + o.items.reduce((iacc, i) => iacc + i.quantity, 0), 0);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-foreground">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full"
                />
                {error && <div className="text-red-500 text-center">{error}</div>}
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-foreground">Admin Dashboard</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{users.length}</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₹{totalProfit.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Items Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalItemsSold}</div>
              </CardContent>
            </Card>
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{orders.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders Table */}
            <Card className="lg:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {ordersLoading ? (
                  <div className="text-center text-muted-foreground">Loading orders...</div>
                ) : ordersError ? (
                  <div className="text-red-500 text-center">{ordersError}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center text-muted-foreground">No orders found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left font-medium text-muted-foreground">Order ID</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Customer</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Total</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Date</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {paginate<Order>(orders, ordersPage, ordersPerPage).map((order) => (
                          <OrderRow
                            key={`order-${order._id}`}
                            order={order}
                            expandedOrder={expandedOrder}
                            toggleOrderDetails={toggleOrderDetails}
                            handleMarkDelivered={handleMarkDelivered}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                  <Button
                    onClick={() => setOrdersPage(prev => Math.max(prev - 1, 1))}
                    disabled={ordersPage === 1}
                    variant="outline"
                    size="sm"
                    className="text-foreground w-full sm:w-auto"
                  >
                    Previous
                  </Button>
                  <span className="text-muted-foreground">
                    Page {ordersPage} of {Math.ceil(orders.length / ordersPerPage)}
                  </span>
                  <Button
                    onClick={() => setOrdersPage(prev => prev + 1)}
                    disabled={ordersPage === Math.ceil(orders.length / ordersPerPage)}
                    variant="outline"
                    size="sm"
                    className="text-foreground w-full sm:w-auto"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Actions */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-4">
                <Button
                  onClick={() => setShowProductModal(true)}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Add New Product
                </Button>
                <Button
                  onClick={() => setShowUsersModal(true)}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  View Users
                </Button>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="lg:col-span-3 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {productsLoading ? (
                  <div className="text-center text-muted-foreground">Loading products...</div>
                ) : productsError ? (
                  <div className="text-red-500 text-center">{productsError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border divide-y divide-border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left font-medium text-muted-foreground">Image</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Name</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Category</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Price</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Stock</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
                          <th className="p-3 text-left font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map((p) => (
                          <tr key={`product-${p._id}`}>
                            <td className="p-3">
                              <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded" />
                            </td>
                            <td className="p-3">{p.name}</td>
                            <td className="p-3">{p.category}</td>
                            <td className="p-3">₹{p.price}</td>
                            <td className="p-3">{p.stockQuantity}</td>
                            <td className="p-3">
                              {p.stockQuantity > 0 ? (
                                <span className="text-green-600 font-medium">In Stock</span>
                              ) : (
                                <span className="text-red-500 font-medium">Out of Stock</span>
                              )}
                            </td>
                            <td className="p-3">
                              <Button
                                variant="link"
                                className="text-primary mr-2 hover:underline"
                                onClick={() => handleRestockProduct(p._id)}
                              >
                                Restock
                              </Button>
                              <Button
                                variant="link"
                                className="text-red-600 hover:underline"
                                onClick={() => handleDeleteProduct(p._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Users Modal */}
          {showUsersModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">Users ({users.length})</CardTitle>
                    <Button
                      variant="ghost"
                      onClick={() => setShowUsersModal(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {usersLoading ? (
                    <div className="text-center text-muted-foreground">Loading users...</div>
                  ) : usersError ? (
                    <div className="text-red-500 text-center">{usersError}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border divide-y divide-border">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-3 text-left font-medium text-muted-foreground">Name</th>
                            <th className="p-3 text-left font-medium text-muted-foreground">Email</th>
                            <th className="p-3 text-left font-medium text-muted-foreground">Phone</th>
                            <th className="p-3 text-left font-medium text-muted-foreground">Address</th>
                            <th className="p-3 text-left font-medium text-muted-foreground">Created</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {paginate<User>(users, usersPage, usersPerPage).map((u) => (
                            <tr key={`user-${u._id}`}>
                              <td className="p-3">{u.firstName} {u.lastName}</td>
                              <td className="p-3">{u.email}</td>
                              <td className="p-3">{u.phone}</td>
                              <td className="p-3">{u.address ? Object.values(u.address).filter(Boolean).join(', ') : ''}</td>
                              <td className="p-3">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                        <Button
                          onClick={() => setUsersPage(prev => Math.max(prev - 1, 1))}
                          disabled={usersPage === 1}
                          variant="outline"
                          size="sm"
                          className="text-foreground w-full sm:w-auto"
                        >
                          Previous
                        </Button>
                        <span className="text-muted-foreground">
                          Page {usersPage} of {Math.ceil(users.length / usersPerPage)}
                        </span>
                        <Button
                          onClick={() => setUsersPage(prev => prev + 1)}
                          disabled={usersPage === Math.ceil(users.length / usersPerPage)}
                          variant="outline"
                          size="sm"
                          className="text-foreground w-full sm:w-auto"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Product Modal */}
          {showProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-lg shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">Add New Product</CardTitle>
                    <Button
                      variant="ghost"
                      onClick={() => setShowProductModal(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <Input
                      name="name"
                      placeholder="Name"
                      value={product.name}
                      onChange={handleProductChange}
                      required
                    />
                    <Input
                      name="description"
                      placeholder="Description"
                      value={product.description}
                      onChange={handleProductChange}
                    />
                    <Input
                      name="price"
                      type="number"
                      placeholder="Price"
                      value={product.price}
                      onChange={handleProductChange}
                      required
                    />
                    <Input
                      name="image"
                      placeholder="Image URL"
                      value={product.image}
                      onChange={handleProductChange}
                    />
                    {product.image && (
                      <img src={product.image} alt="Preview" className="h-24 w-24 object-cover rounded mx-auto" />
                    )}
                    <Input
                      name="category"
                      placeholder="Category"
                      value={product.category}
                      onChange={handleProductChange}
                      required
                    />
                    <Input
                      name="stockQuantity"
                      type="number"
                      placeholder="Stock Quantity"
                      value={product.stockQuantity}
                      onChange={handleProductChange}
                      required
                    />
                    <Select
                      name="inStock"
                      value={product.inStock ? 'true' : 'false'}
                      onValueChange={(value) => setProduct(prev => ({ ...prev, inStock: value === 'true' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Stock Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">In Stock</SelectItem>
                        <SelectItem value="false">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      disabled={productLoading}
                    >
                      {productLoading ? 'Adding...' : 'Add Product'}
                    </Button>
                    {productMsg && (
                      <div className={`text-center ${productMsg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                        {productMsg}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}