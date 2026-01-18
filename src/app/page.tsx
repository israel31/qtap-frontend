'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-purple-900/95 backdrop-blur-lg shadow-xl' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <span className="text-white text-2xl font-bold">qTap</span>
            </div>
            <Link
              href="/login"
              className="text-white bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-all duration-300 font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="text-center text-white max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full mb-8 border border-white/30">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Starting from UNIBEN 🎓</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight drop-shadow-2xl">
            Cashless Rides,
            <br />
            <span className="text-yellow-300">
              Seamless Payments
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Say goodbye to cash hassles. Fund your wallet, scan to pay, and ride with confidence.
            The future of campus transportation is here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register?type=user"
              className="group bg-white text-purple-700 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl transform transition-all duration-300 shadow-xl"
            >
              <span className="flex items-center justify-center">
                Get Started as Passenger
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/register?type=driver"
              className="group bg-purple-800 text-white border-2 border-white/50 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 hover:scale-105 transform transition-all duration-300 shadow-xl"
            >
              <span className="flex items-center justify-center">
                Register as Driver
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
              <div className="text-4xl font-bold mb-2">⚡</div>
              <div className="text-sm font-semibold mb-1">Fast</div>
              <div className="text-purple-200 text-xs">Instant Payments</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
              <div className="text-4xl font-bold mb-2">🔒</div>
              <div className="text-sm font-semibold mb-1">Secure</div>
              <div className="text-purple-200 text-xs">Bank-Level Security</div>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all">
              <div className="text-4xl font-bold mb-2">✨</div>
              <div className="text-sm font-semibold mb-1">Simple</div>
              <div className="text-purple-200 text-xs">Scan & Pay</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How qTap Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your transportation experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl">
                  <span className="text-5xl">💳</span>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fund Your Wallet</h3>
              <p className="text-gray-600 leading-relaxed">
                Add money to your qTap wallet securely using Flutterwave. Quick, safe, and hassle-free.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl">
                  <span className="text-5xl">📱</span>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scan QR Code</h3>
              <p className="text-gray-600 leading-relaxed">
                Simply scan your driver's QR code when you board. No cash, no change, no stress.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-3xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl">
                  <span className="text-5xl">🚗</span>
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Ride Safely</h3>
              <p className="text-gray-600 leading-relaxed">
                Every transaction is recorded and secure. Track your rides and spending with ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Drivers Section */}
      <div className="relative bg-gradient-to-br from-purple-900 to-purple-800 py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="text-white">
              <div className="inline-block bg-purple-600 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
                FOR DRIVERS
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Earn More, Stress Less
              </h2>
              <p className="text-purple-200 text-lg mb-8 leading-relaxed">
                Get paid automatically every day. No more cash handling, no more counting coins.
                Just focus on driving.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-bold text-lg">Daily Automated Payouts</div>
                    <div className="text-purple-300 text-sm">Money hits your account every evening at 8 PM</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-bold text-lg">Your Unique QR Code</div>
                    <div className="text-purple-300 text-sm">Easy for passengers to scan and pay instantly</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-bold text-lg">Track Your Earnings</div>
                    <div className="text-purple-300 text-sm">See all your trips and income in one dashboard</div>
                  </div>
                </li>
              </ul>
              <Link
                href="/register?type=driver"
                className="inline-block bg-white text-purple-700 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Start Earning Today →
              </Link>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-600 mb-2 font-semibold">Your Daily Earnings</div>
                    <div className="text-5xl font-bold text-purple-700">₦12,500</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600 font-medium">Total Trips</span>
                      <span className="font-bold text-gray-900 text-lg">47</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600 font-medium">Average per Trip</span>
                      <span className="font-bold text-gray-900 text-lg">₦266</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Next Payout</span>
                      <span className="font-bold text-purple-700 text-lg">Today 8PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join hundreds of UNIBEN students and drivers already using qTap
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?type=user"
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl transform transition-all duration-300 shadow-xl"
            >
              Create Account - It's Free
            </Link>
            <Link
              href="/login"
              className="bg-gray-100 text-gray-900 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-300 border-2 border-gray-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-xl">⚡</span>
              </div>
              <span className="text-white text-xl font-bold">qTap</span>
            </div>
            <div className="text-center md:text-right">
              <p className="font-semibold text-gray-300">© 2026 qTap. Built for UNIBEN, expanding everywhere.</p>
              <p className="text-sm mt-2">Cashless transportation made simple.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}