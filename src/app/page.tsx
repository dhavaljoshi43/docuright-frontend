'use client';

import { useState } from 'react';
import Image from "next/image";
import { NdaForm } from '@/components/NdaForm';
import { OfferLetterForm } from '@/components/OfferLetterForm';
import { AuthModal } from '@/components/AuthForms';
import { useAuth } from '@/contexts/AuthContext';

type DocType = 'none' | 'nda' | 'offer';

export default function Dashboard() {
  const [docType, setDocType] = useState<DocType>('none');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-green-100 overflow-hidden">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />

      {/* Decorative SVG background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full">
          <ellipse cx="20%" cy="10%" rx="250" ry="100" fill="#6366f1" fillOpacity="0.065" />
          <ellipse cx="85%" cy="80%" rx="280" ry="120" fill="#22c55e" fillOpacity="0.07" />
        </svg>
      </div>

      {/* Header with Auth */}
      <div className="absolute top-0 right-0 p-6 z-20">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.fullName || user?.email}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Sign In
          </button>
        )}
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo + Tagline */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Image
            src="/docuright-logo.png"
            alt="DocuRight AI Logo"
            width={80}
            height={80}
            className="rounded-none drop-shadow-md mb-2"
            priority
          />
          <div className="text-lg text-gray-500 mt-2 text-center font-semibold">
            The fastest way to automate legal paperwork with AI.
          </div>
        </div>

        {/* Dashboard Card Grid */}
        {docType === 'none' && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Generate a Document</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
              {/* NDA Card */}
              <button
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-2xl flex flex-col items-center transition-all duration-200 hover:bg-indigo-50 w-full transform hover:-translate-y-2"
                onClick={() => setDocType('nda')}
              >
                <div className="mb-2 w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-full">
                  <span role="img" aria-label="NDA" className="text-3xl">📝</span>
                </div>
                <div className="font-semibold text-xl mb-1 text-indigo-700">NDA</div>
                <div className="text-gray-600 text-sm text-center">
                  Create Non-Disclosure Agreements to protect your business secrets.
                </div>
              </button>
              {/* Offer Letter Card */}
              <button
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-2xl flex flex-col items-center transition-all duration-200 hover:bg-green-50 w-full transform hover:-translate-y-2"
                onClick={() => setDocType('offer')}
              >
                <div className="mb-2 w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
                  <span role="img" aria-label="Offer" className="text-3xl">📄</span>
                </div>
                <div className="font-semibold text-xl mb-1 text-green-700">Offer Letter</div>
                <div className="text-gray-600 text-sm text-center">
                  Generate professional employment offer letters instantly.
                </div>
              </button>
              {/* Coming soon */}
              <div
                className="p-6 rounded-xl bg-gray-100 shadow-inner flex flex-col items-center justify-center w-full opacity-70"
              >
                <div className="mb-2 w-16 h-16 flex items-center justify-center bg-gray-300 rounded-full">
                  <span role="img" aria-label="Coming soon" className="text-3xl">✨</span>
                </div>
                <div className="font-semibold text-xl mb-1 text-gray-500">More templates</div>
                <div className="text-gray-400 text-sm text-center">
                  Coming soon...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multistep Form appears after selection */}
        {docType === 'nda' && (
          <div>
            <button
              onClick={() => setDocType('none')}
              className="text-indigo-600 hover:underline mb-3"
            >← Back to document selection</button>
            <NdaForm />
          </div>
        )}
        {docType === 'offer' && (
          <div>
            <button
              onClick={() => setDocType('none')}
              className="text-green-600 hover:underline mb-3"
            >← Back to document selection</button>
            <OfferLetterForm />
          </div>
        )}
      </div>

      {/* Polished Footer */}
      <footer className="mt-16 z-10 w-full relative text-center text-xs text-gray-400 opacity-90 pb-4">
        © {new Date().getFullYear()} DocuRight AI. All rights reserved.
      </footer>
    </main>
  );
}