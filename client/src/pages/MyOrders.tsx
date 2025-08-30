import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

  const fetchOrders = async () => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const response = await fetch('https://sevipure-server.onrender.com/api/order/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      const fetchedOrders = (data.orders || []) as Order[];
      fetchedOrders.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, token]);

  useEffect(() => {
    let filtered = [...orders];
    
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

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
    setPage(1);
  }, [statusFilter, startDate, endDate, orders]);

  const paginate = <T,>(data: T[], page: number, perPage: number): T[] => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const toggleOrderDetails = (id: string) => {
    setExpandedOrder(prev => (prev === id ? null : id));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Placed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Track your purchase history and order status effortlessly
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mb-10"
          >
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-lg">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Placed">Placed</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white border-gray-200 focus:ring-2 focus:ring-green-500 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {!isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card className="text-center border-none shadow-xl bg-white/95 backdrop-blur-sm rounded-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Please Log In</h2>
                  <p className="text-gray-600 mb-6">Sign in to view your order history and track your purchases.</p>
                  <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                    <Link to="/login">Go to Login</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div>
              {loading ? (
                <motion.div 
                  className="text-center text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Loading orders...
                </motion.div>
              ) : error ? (
                <motion.div 
                  className="text-center text-red-500 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              ) : filteredOrders.length === 0 ? (
                <motion.div 
                  className="text-center text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  No orders found.
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                      {paginate<Order>(filteredOrders, page, ordersPerPage).map((order) => (
                        <motion.div
                          key={order._id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Card
                            className="relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 bg-white rounded-xl cursor-pointer"
                            onClick={() => toggleOrderDetails(order._id)}
                          >
                            <CardHeader className="pb-3 px-6 pt-5">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                                  Order #{order._id.slice(-6)}
                                </CardTitle>
                                <span
                                  className={`text-xs font-medium px-3 py-1.5 rounded-full shadow-sm ${getStatusStyles(order.status)}`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold text-gray-700 mr-2">Total:</span>
                                  <span className="text-gray-900 font-medium">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold text-gray-700 mr-2">Items:</span>
                                  <span className="text-gray-900 font-medium">{order.items.length}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm font-semibold text-gray-700 mr-2">Date:</span>
                                  <span className="text-gray-900 font-medium">{formatDate(order.createdAt)}</span>
                                </div>
                              </div>
                              <AnimatePresence>
                                {expandedOrder === order._id && (
                                  <motion.div
                                    variants={expandVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="mt-6 pt-6 border-t border-gray-200"
                                  >
                                    <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                                      Order Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h5 className="font-semibold text-gray-900 mb-3">Items Ordered</h5>
                                        <ul className="space-y-3">
                                          {order.items.map((item) => (
                                            <li
                                              key={item.productId}
                                              className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-md"
                                            >
                                              <span>{item.name} x {item.quantity}</span>
                                              <span className="font-medium">₹{item.price.toFixed(2)}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-gray-900 mb-3">Shipping Details</h5>
                                        <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-3 rounded-md">
                                          <p className="font-medium">{order.contactName}</p>
                                          <p>{order.contactPhone}</p>
                                          <p>
                                            {order.address
                                              ? Object.values(order.address).filter(Boolean).join(', ')
                                              : 'No address provided'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <motion.div 
                    className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-gray-300 text-gray-900 hover:bg-green-50 font-semibold rounded-lg"
                    >
                      Previous
                    </Button>
                    <span className="text-gray-600 font-medium">
                      Page {page} of {Math.ceil(filteredOrders.length / ordersPerPage)}
                    </span>
                    <Button
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={page === Math.ceil(filteredOrders.length / ordersPerPage)}
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto border-gray-300 text-gray-900 hover:bg-green-50 font-semibold rounded-lg"
                    >
                      Next
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;