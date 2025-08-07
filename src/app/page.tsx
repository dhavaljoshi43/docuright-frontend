'use client';

import { useState } from 'react';
import Image from "next/image";
import { NdaForm } from '@/components/NdaForm';
import { OfferLetterForm } from '@/components/OfferLetterForm';

type DocType = 'none' | 'nda' | 'offer';

export default function Dashboard() {
  const [docType, setDocType] = useState<DocType>('none');

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-green-100 overflow-hidden">
      {/* Decorative SVG background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full">
          <ellipse cx="20%" cy="10%" rx="250" ry="100" fill="#6366f1" fillOpacity="0.065" />
          <ellipse cx="85%" cy="80%" rx="280" ry="120" fill="#22c55e" fillOpacity="0.07" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Centered Logo */}
        <div className="flex items-center justify-center mb-10">
          <Image
            src="/docuright-logo.png"
            alt="DocuRight AI Logo"
            width={120}
            height={120}
            className="rounded-none drop-shadow-md"
            priority
          />
        </div>

        {/* Dashboard Card Grid */}
        {docType === 'none' && (
          <div>
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Generate a Document</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
              {/* NDA Card */}
              <button
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-2xl flex flex-col items-center transition-all hover:bg-indigo-50 w-full"
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
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-2xl flex flex-col items-center transition-all hover:bg-green-50 w-full"
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
    </main>
  );
}
