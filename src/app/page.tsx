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
    <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-indigo-100 via-white to-green-100">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />

      {/* Header */}
      <div className="relative z-20 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/docuright-logo.png" alt="DocuRight AI" width={40} height={40} className="rounded" priority />
            <span className="text-xl font-bold text-gray-900">DocuRight AI</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <a href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                  My Documents
                </a>
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-medium text-gray-700">{user?.fullName || user?.email}</p>
                  <button onClick={logout} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {docType === 'none' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center mb-12 max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Generate Legal Documents in Minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI-powered document generation for businesses. Lawyer-reviewed templates, instant PDFs.
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Lawyer Reviewed</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>10,000+ Documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Indian Law Compliant</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-4xl mb-16">
            <h2 className="text-2xl font-bold text-center mb-6">Choose Your Document</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setDocType('nda')} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">NDA</h3>
                <p className="text-gray-600 text-sm">Protect confidential information</p>
              </button>
              
              <button onClick={() => setDocType('offer')} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">📄</span>
                </div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">Offer Letter</h3>
                <p className="text-gray-600 text-sm">Professional employment offers</p>
              </button>
              
              <div className="p-6 bg-gray-100 rounded-xl opacity-70">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">More Coming</h3>
                <p className="text-gray-400 text-sm">Contracts and more</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-semibold text-lg mb-2">Fill Simple Form</h3>
                <p className="text-gray-600 text-sm">Answer questions about your needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-semibold text-lg mb-2">AI Generates</h3>
                <p className="text-gray-600 text-sm">Customized legal document</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-semibold text-lg mb-2">Download & Use</h3>
                <p className="text-gray-600 text-sm">PDF ready to sign</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {docType === 'nda' && (
        <div className="flex-1 px-6 py-8">
          <button onClick={() => setDocType('none')} className="text-indigo-600 hover:underline mb-4">
            ← Back
          </button>
          <NdaForm />
        </div>
      )}
      
      {docType === 'offer' && (
        <div className="flex-1 px-6 py-8">
          <button onClick={() => setDocType('none')} className="text-green-600 hover:underline mb-4">
            ← Back
          </button>
          <OfferLetterForm />
        </div>
      )}

      <footer className="bg-white/80 py-6 border-t">
        <div className="max-w-7xl mx-auto px-6 flex justify-between text-sm text-gray-500">
          <p>© 2025 DocuRight AI</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}