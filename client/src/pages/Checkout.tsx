import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import Footer from '@/components/Layout/Footer';

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState<any>(null);
  const [contactName, setContactName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [contactPhone, setContactPhone] = useState(user ? user.phone : '');
  const [contactEmail, setContactEmail] = useState(user ? user.email : '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await fetch('https://sevipure-server.onrender.com/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.user && data.user.address) {
          setAddress(data.user.address);
          setContactName(`${data.user.firstName} ${data.user.lastName}`);
          setContactPhone(data.user.phone);
          setContactEmail(data.user.email);
        } else {
          setError('Failed to fetch profile data');
        }
      } catch {
        setError('Failed to fetch profile data');
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://sevipure-server.onrender.com/api/order/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ address, contactName, contactPhone })
      });
      const data = await response.json();
      if (response.ok) {
        setOrder(data.order);
        clearCart();
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (err) {
      setError('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-primary border-gray-200 rounded-full"
        />
      </div>
    );
  }

  if (order) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 p-6 sm:p-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white max-w-lg w-full p-8 rounded-xl shadow-lg"
          >
            <Confetti numberOfPieces={100} recycle={false} className="w-full h-full" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="flex justify-center mb-6"
            >
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
              Order Placed Successfully!
            </h1>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Details</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium text-primary">Order ID:</span> {order._id}</p>
                <p><span className="font-medium text-primary">Name:</span> {order.contactName}</p>
                <p><span className="font-medium text-primary">Email:</span> {contactEmail}</p>
                <p><span className="font-medium text-primary">Phone:</span> {order.contactPhone}</p>
                <p>
                  <span className="font-medium text-primary">Address:</span>{' '}
                  {order.address ? Object.values(order.address).filter(Boolean).join(', ') : 'N/A'}
                </p>
                <p><span className="font-medium text-primary">Total Amount:</span> ₹{order.totalAmount}</p>
                <p>
                  <span className="font-medium text-primary">Placed At:</span>{' '}
                  {new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
                <div>
                  <span className="font-medium text-primary">Items:</span>
                  <ul className="list-disc ml-6 mt-2">
                    {order.items.map((item: any) => (
                      <li key={item.productId} className="text-gray-600">
                        {item.name} x {item.quantity} <span className="text-primary">(₹{item.price})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold"
              onClick={() => navigate('/')}
            >
              Go to Home
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Checkout</h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Shipping Address</h2>
            <div className="mb-6">
              {address ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
                  {Object.values(address).filter(Boolean).join(', ')}
                </div>
              ) : (
                <div className="text-red-500 font-medium">No address found in your profile.</div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Contact Details</h2>
            <div className="space-y-4 mb-6">
              <p className="text-gray-600"><span className="font-medium text-primary">Name:</span> {contactName}</p>
              <p className="text-gray-600"><span className="font-medium text-primary">Email:</span> {contactEmail}</p>
              <p className="text-gray-600"><span className="font-medium text-primary">Phone:</span> {contactPhone}</p>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Payment Method</h2>
            <div className="mb-6">
              <label className="flex items-center text-gray-600">
                <input type="radio" checked disabled className="h-5 w-5 text-primary" />
                <span className="ml-2">Pay on Delivery</span>
              </label>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 mb-4 font-medium"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className={`w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center ${
                loading || !address ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || !address}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-t-white border-gray-200 rounded-full mr-2"
                />
              ) : null}
              {loading ? 'Placing Order...' : 'Place Order'}
            </motion.button>
          </motion.form>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Order Summary</h2>
            <ul className="space-y-3 mb-6">
              {items.map(item => (
                <li key={item.productId} className="flex justify-between text-gray-600">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="text-primary">₹{item.price}</span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4">
              <p className="flex justify-between font-bold text-gray-800">
                <span>Total:</span>
                <span>₹{totalAmount}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

    </>
  );
}
