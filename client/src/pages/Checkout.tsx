import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState<any>(null);
  const [contactName, setContactName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [contactPhone, setContactPhone] = useState(user ? user.phone : '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile to get address
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
        } else {
          setError('Failed to fetch address from profile');
        }
      } catch {
        setError('Failed to fetch address from profile');
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

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

  if (order) {
    return (
      <div className="min-h-screen bg-background p-8">
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <div><b>Order ID:</b> {order._id}</div>
          <div><b>Name:</b> {order.contactName}</div>
          <div><b>Phone:</b> {order.contactPhone}</div>
          <div><b>Address:</b> {order.address ? Object.values(order.address).filter(Boolean).join(', ') : ''}</div>
          <div><b>Total Amount:</b> ₹{order.totalAmount}</div>
          <div className="mt-4">
            <b>Items:</b>
            <ul className="list-disc ml-6">
              {order.items.map((item: any) => (
                <li key={item.productId}>{item.name} x {item.quantity} (₹{item.price})</li>
              ))}
            </ul>
          </div>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  if (profileLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading address...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="mb-4">
          {address ? (
            <div className="p-3 bg-gray-50 rounded border">
              {Object.values(address).filter(Boolean).join(', ')}
            </div>
          ) : (
            <div className="text-red-500">No address found in your profile.</div>
          )}
        </div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Contact Details</h2>
        <div className="mb-2">{contactName}</div>
        <div className="mb-4">{contactPhone}</div>
        <h2 className="text-xl font-semibold mt-6 mb-4">Payment Method</h2>
        <div className="mb-4">
          <input type="radio" checked disabled /> <span className="ml-2">Pay on Delivery</span>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full" disabled={loading || !address}>{loading ? 'Placing Order...' : 'Place Order'}</button>
      </form>
      <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="mb-4">
          {items.map(item => (
            <li key={item.productId}>{item.name} x {item.quantity} (₹{item.price})</li>
          ))}
        </ul>
        <div className="font-bold">Total: ₹{totalAmount}</div>
      </div>
    </div>
  );
}
