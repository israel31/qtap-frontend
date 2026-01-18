'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function FundingCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const txRef = searchParams.get('tx_ref');
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transaction_id');

    console.log('Payment callback params:', { txRef, status, transactionId });

    if (status === 'successful' && txRef) {
      verifyPayment(txRef);
    } else if (status === 'cancelled') {
      setMessage('Payment was cancelled');
      toast.error('Payment was cancelled');
      setTimeout(() => router.push('/dashboard/user'), 2000);
    } else {
      setMessage('Payment status unclear, checking...');
      if (txRef) {
        verifyPayment(txRef);
      } else {
        toast.error('Payment failed - no transaction reference');
        setTimeout(() => router.push('/dashboard/user'), 2000);
      }
    }
  }, [searchParams, router]);

  const verifyPayment = async (txRef: string) => {
    try {
      setVerifying(true);
      setMessage('Contacting payment processor...');
      
      console.log('Verifying payment with tx_ref:', txRef);
      
      const response = await api.get(`/payments/verify?tx_ref=${txRef}`);
      
      console.log('Verification response:', response.data);
      
      if (response.data.success) {
        setMessage('Payment confirmed! Updating wallet...');
        toast.success('Payment successful! Wallet funded!');
        
        setTimeout(() => {
          router.push('/dashboard/user');
        }, 2000);
      } else {
        setMessage('Payment verification failed');
        toast.error('Payment verification failed. Please contact support.');
        setTimeout(() => router.push('/dashboard/user'), 3000);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      console.error('Error response:', error.response?.data);
      
      setMessage('Error verifying payment');
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error('Error verifying payment. Please check your wallet or contact support.');
        setTimeout(() => router.push('/dashboard/user'), 3000);
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-800 text-lg font-semibold mb-2">{message}</p>
            <p className="text-gray-500 text-sm">Please wait, do not refresh...</p>
          </>
        ) : (
          <>
            <div className="text-purple-600 text-6xl mb-4">✓</div>
            <p className="text-gray-800 text-lg font-semibold mb-2">{message}</p>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function FundingCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <FundingCallbackContent />
    </Suspense>
  );
}