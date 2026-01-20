// ============================================
// src/app/dashboard/driver/page.tsx (DRIVER DASHBOARD)
// ============================================
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    bankCode: '',
  });

  useEffect(() => {
    if (!user) router.push('/login');
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [profileRes, walletRes, statsRes, txRes, payoutsRes] =
        await Promise.all([
          api.get('/drivers/profile'),
          api.get('/wallets/my-wallet'),
          api.get('/drivers/stats'),
          api.get('/drivers/transactions'),
          api.get('/drivers/payouts'),
        ]);

      setProfile(profileRes.data);
      setWallet(walletRes.data);
      setStats(statsRes.data);
      setTransactions(txRes.data);
      setPayouts(payoutsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleGenerateQR = async () => {
    try {
      const { data } = await api.post('/drivers/generate-qr');
      toast.success('QR Code generated!');
      setProfile({ ...profile, qr_code_url: data.qrCodeUrl });
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const handleSaveBankDetails = async () => {
    try {
      await api.post('/drivers/bank-details', bankDetails);
      toast.success('Bank details saved!');
      fetchData();
    } catch (error) {
      toast.error('Failed to save bank details');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">qTap Driver</h1>
            <p className="text-sm">{profile?.full_name}</p>
            <p className="text-xs opacity-90">ID: {profile?.driver_unique_id}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Wallet & QR */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Wallet */}
          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-90">Wallet Balance</p>
            <p className="text-4xl font-bold mb-2">
              ₦{wallet?.balance?.toLocaleString() || '0.00'}
            </p>
            <p className="text-sm opacity-90">
              Next payout: Today at 8:00 PM
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-lg p-6 shadow text-center">
            {profile?.qr_code_url ? (
              <>
                <img
                  src={profile.qr_code_url}
                  alt="Driver QR Code"
                  className="w-48 h-48 mx-auto mb-4"
                />
                <p className="text-sm text-gray-600 mb-2">
                  {profile.driver_unique_id}
                </p>
                <a
                  href={profile.qr_code_url}
                  download
                  className="text-primary-600 hover:underline text-sm"
                >
                  Download QR Code
                </a>
              </>
            ) : (
              <button
                onClick={handleGenerateQR}
                className="bg-primary-600 text-white px-6 py-3 rounded font-semibold hover:bg-primary-700"
              >
                Generate My QR Code
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 mb-2">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-800">
              ₦{stats?.totalEarnings?.toLocaleString() || '0.00'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 mb-2">Total Passengers</p>
            <p className="text-2xl font-bold text-gray-800">
              {stats?.totalPassengers || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 mb-2">Total Payouts</p>
            <p className="text-2xl font-bold text-gray-800">
              {payouts.filter((p) => p.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Bank Details */}
        {!profile?.driver_bank_details && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Add Bank Details for Payouts</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Bank Name"
                value={bankDetails.bankName}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, bankName: e.target.value })
                }
                className="px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountNumber: e.target.value,
                  })
                }
                className="px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                value={bankDetails.accountHolderName}
                onChange={(e) =>
                  setBankDetails({
                    ...bankDetails,
                    accountHolderName: e.target.value,
                  })
                }
                className="px-4 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Bank Code (e.g., 058 for GTBank)"
                value={bankDetails.bankCode}
                onChange={(e) =>
                  setBankDetails({ ...bankDetails, bankCode: e.target.value })
                }
                className="px-4 py-2 border rounded"
              />
            </div>
            <button
              onClick={handleSaveBankDetails}
              className="bg-primary-600 text-white px-6 py-2 rounded font-semibold hover:bg-primary-700"
            >
              Save Bank Details
            </button>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Trips</h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    Passenger: {tx.users?.full_name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
                <p className="font-bold text-primary-600">
                  +₦{parseFloat(tx.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Payout History</h2>
          </div>
          <div className="divide-y">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold capitalize">{payout.status}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(payout.created_at).toLocaleString()}
                  </p>
                  {payout.failure_reason && (
                    <p className="text-sm text-red-600">
                      {payout.failure_reason}
                    </p>
                  )}
                </div>
                <p
                  className={`font-bold ${
                    payout.status === 'completed'
                      ? 'text-primary-600'
                      : 'text-gray-600'
                  }`}
                >
                  ₦{parseFloat(payout.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}