import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Link } from 'react-router-dom';

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

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const ordersPerPage = 5;
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const token = localStorage.getItem('token') || '';

  const fetchOrders = () => {
    if (isAuthenticated && user) {
      setLoading(true);
      fetch('https://sevipure-server.onrender.com/api/order/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const fetchedOrders = (data.orders || []) as Order[];
          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load orders');
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds to check for status updates
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, token]);

  useEffect(() => {
    let filtered = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter(order => 
        order.createdAt && new Date(order.createdAt).getTime() >= start
      );
    }
    if (endDate) {
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => 
        order.createdAt && new Date(order.createdAt).getTime() <= end
      );
    }

    setFilteredOrders(filtered);
    setPage(1); // Reset to first page when filters change
  }, [statusFilter, startDate, endDate, orders]);

  const paginate = <T,>(data: T[], page: number, perPage: number): T[] => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const toggleOrderDetails = (id: string) => {
    setExpandedOrder(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-foreground">My Orders</h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              View your order history and track the status of your purchases
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-full md:w-1/4">
                    <label className="text-sm font-medium text-foreground block mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Placed">Placed</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="text-sm font-medium text-foreground block mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="text-sm font-medium text-foreground block mb-1">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {!isAuthenticated ? (
            <Card className="text-center">
              <CardContent className="p-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Please Log In</h2>
                <p className="text-muted-foreground mb-6">You need to be logged in to view your orders.</p>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/login">Go to Login</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div>
              {loading ? (
                <div className="text-center text-muted-foreground">Loading orders...</div>
              ) : error ? (
                <div className="text-center text-red-500">{error}</div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center text-muted-foreground">No orders found.</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    {paginate<Order>(filteredOrders, page, ordersPerPage).map((order) => (
                      <Card
                        key={order._id}
                        className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        <CardHeader>
                          <CardTitle className="text-base md:text-lg font-semibold">
                            Order #{order._id.slice(-6)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                          <div className="space-y-2">
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">Total:</span> ₹{order.totalAmount}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">Status:</span>{' '}
                              {order.status === 'Delivered' ? (
                                <span className="text-green-600">{order.status}</span>
                              ) : (
                                <span className="text-yellow-600">{order.status}</span>
                              )}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium text-foreground">Date:</span>{' '}
                              {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                            </p>
                          </div>
                          {expandedOrder === order._id && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <h4 className="font-semibold text-foreground mb-2">Order Summary</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-foreground">Items</h5>
                                  <ul className="list-disc ml-6 text-muted-foreground">
                                    {order.items.map((item) => (
                                      <li key={item.productId}>
                                        {item.name} x {item.quantity} (₹{item.price})
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-foreground">Shipping Address</h5>
                                  <p className="text-muted-foreground">{order.contactName}</p>
                                  <p className="text-muted-foreground">{order.contactPhone}</p>
                                  <p className="text-muted-foreground">
                                    {order.address ? Object.values(order.address).filter(Boolean).join(', ') : 'No address provided'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                    <Button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      variant="outline"
                      size="sm"
                      className="text-foreground w-full sm:w-auto"
                    >
                      Previous
                    </Button>
                    <span className="text-muted-foreground">
                      Page {page} of {Math.ceil(filteredOrders.length / ordersPerPage)}
                    </span>
                    <Button
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={page === Math.ceil(filteredOrders.length / ordersPerPage)}
                      variant="outline"
                      size="sm"
                      className="text-foreground w-full sm:w-auto"
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyOrders;