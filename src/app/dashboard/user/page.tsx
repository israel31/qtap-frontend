'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Dynamically import QR Scanner (avoids SSR issues)
const QRScanner = dynamic(() => import('@/components/QRScanner'), {
  ssr: false,
  loading: () => <div className="text-center p-4">Loading scanner...</div>,
});

export default function UserDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [wallet, setWallet] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fundAmount, setFundAmount] = useState('');
  const [scanMode, setScanMode] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [driverCode, setDriverCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'user') {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, statsRes, txRes] = await Promise.all([
        api.get('/wallets/my-wallet'),
        api.get('/users/stats'),
        api.get('/transactions/my-transactions'),
      ]);

      setWallet(walletRes.data);
      setStats(statsRes.data);
      setTransactions(txRes.data);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        router.push('/login');
      } else {
        toast.error('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFundWallet = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const { data } = await api.post('/payments/fund-wallet', {
        amount: parseFloat(fundAmount),
      });

      window.location.href = data.paymentLink;
    } catch (error) {
      toast.error('Failed to initialize payment');
    }
  };

  const handleQRScan = (scannedCode: string) => {
    console.log('Scanned:', scannedCode);
    setDriverCode(scannedCode);
    setShowScanner(false);
    setScanMode(true);
    toast.success('QR code scanned! Confirm payment below.');
  };

  const handlePayDriver = async () => {
    if (!driverCode) {
      toast.error('Please scan a QR code or enter driver ID');
      return;
    }

    if (paymentProcessing) {
      return;
    }

    try {
      setPaymentProcessing(true);
      
      await api.post('/payments/qr-payment', {
        driverUniqueId: driverCode,
      });

      toast.success('Payment successful!');
      setDriverCode('');
      setScanMode(false);
      fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6">
  <div className="container mx-auto flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold">qTap Passenger</h1>
      <p className="text-sm">{user?.full_name || 'User'}</p>
    </div>
    <button
      onClick={() => {
        logout();
        router.push('/');
      }}
      className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100 font-semibold"
    >
      Logout
    </button>
  </div>
</div>

      <div className="container mx-auto px-4 py-8">
        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg p-6 mb-8">
  <p className="text-sm opacity-90 font-semibold">Wallet Balance</p>
  <p className="text-4xl font-bold mb-4">
    ₦{wallet?.balance ? parseFloat(wallet.balance).toLocaleString() : '0.00'}
  </p>

  <div className="flex gap-4">
    <button
      onClick={() => document.getElementById('fundModal')?.classList.remove('hidden')}
      className="bg-white text-purple-600 px-6 py-2 rounded font-bold hover:bg-gray-100"
    >
      Fund Wallet
    </button>
    <button
      onClick={() => setShowScanner(true)}
      className="bg-purple-800 text-white px-6 py-2 rounded font-bold hover:bg-purple-900"
    >
      📷 Scan QR to Pay
    </button>
  </div>
</div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-gray-800">
              ₦{stats?.totalSpent?.toLocaleString() || '0.00'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 mb-2">Total Trips</p>
            <p className="text-3xl font-bold text-gray-800">
              {stats?.totalTrips || 0}
            </p>
          </div>
        </div>

        {/* Payment Confirmation */}
        {scanMode && driverCode && (
          <div className="bg-white rounded-lg p-6 shadow mb-8 border-2 border-primary-600">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-sm text-gray-600 mb-2">Driver ID:</p>
              <p className="text-lg font-bold text-gray-800">{driverCode}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePayDriver}
                disabled={paymentProcessing}
                className={`flex-1 bg-primary-600 text-white px-6 py-3 rounded font-semibold hover:bg-primary-700 ${
                  paymentProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {paymentProcessing ? 'Processing...' : 'Confirm Payment'}
              </button>
              <button
                onClick={() => {
                  setScanMode(false);
                  setDriverCode('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Or{' '}
              <button
                onClick={() => setShowScanner(true)}
                className="text-primary-600 underline"
              >
                scan another QR code
              </button>
            </p>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Transaction History</h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {tx.type === 'payment'
                        ? `Payment to ${tx.drivers?.driver_unique_id || 'Driver'}`
                        : 'Wallet Funding'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.type === 'payment' ? 'text-red-600' : 'text-primary-600'
                      }`}
                    >
                      {tx.type === 'payment' ? '-' : '+'}₦
                      {parseFloat(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{tx.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Fund Wallet Modal */}
      <div id="fundModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Fund Wallet</h2>
          <input
            type="number"
            placeholder="Enter amount (e.g., 5000)"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex gap-4">
            <button
              onClick={handleFundWallet}
              className="flex-1 bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700"
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => {
                document.getElementById('fundModal')?.classList.add('hidden');
                setFundAmount('');
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}