'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [type, setType] = useState<'user' | 'driver' | 'admin'>('user');
  const [formData, setFormData] = useState({
    phone: '',
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const endpoint = `/auth/login/${type}`;
      const payload =
        type === 'admin'
          ? { username: formData.username, password: formData.password }
          : { phone: formData.phone, password: formData.password };

      const { data } = await api.post(endpoint, payload);

      const user = data.user || data.driver || data.admin;
      setAuth(user, type, data.token);

      toast.success('Login successful!');
      router.push(`/dashboard/${type}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Login to qTap</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setType('user')}
            className={`flex-1 py-2 rounded text-sm ${
              type === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            User
          </button>
          <button
            onClick={() => setType('driver')}
            className={`flex-1 py-2 rounded text-sm ${
              type === 'driver'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Driver
          </button>
          <button
            onClick={() => setType('admin')}
            className={`flex-1 py-2 rounded text-sm ${
              type === 'admin'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'admin' ? (
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          ) : (
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded font-semibold hover:bg-primary-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}