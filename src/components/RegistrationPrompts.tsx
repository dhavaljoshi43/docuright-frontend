// src/components/RegistrationPrompts.tsx
'use client';

import { useState } from 'react';
import AnonymousTracker from '@/lib/anonymousTracking';

interface RegistrationBannerProps {
  onClose: () => void;
  onRegister: () => void;
}

export function RegistrationBanner({ onClose, onRegister }: RegistrationBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 shadow-lg z-50 animate-slide-up">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Document Generated Successfully!</h3>
            <p className="text-sm text-blue-100">
              Create a free account to save your documents and access AI-powered features
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRegister}
            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Create Free Account
          </button>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white px-3 py-2"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

interface RegistrationModalProps {
  onClose: () => void;
  onRegister: () => void;
  remainingGenerations: number;
}

export function RegistrationModal({ onClose, onRegister, remainingGenerations }: RegistrationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You're on a roll!
          </h2>
          
          <p className="text-gray-600 mb-6">
            You've generated 2 documents. Create a free account to unlock more features and save your work.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-left">Free Account Benefits:</h3>
            <ul className="text-left space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save and access your document history</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Regenerate or edit previous documents</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-powered document enhancements</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={onRegister}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create Free Account
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-900 px-6 py-2 text-sm"
            >
              Continue without account ({remainingGenerations} {remainingGenerations === 1 ? 'generation' : 'generations'} left)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RegistrationGateProps {
  onRegister: () => void;
  totalGenerated: number;
}

export function RegistrationGate({ onRegister, totalGenerated }: RegistrationGateProps) {
  const [showSkip, setShowSkip] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Free Limit Reached
        </h2>
        
        <p className="text-lg text-gray-600 mb-2">
          You've generated {totalGenerated} documents!
        </p>
        
        <p className="text-gray-600 mb-8">
          Create a <span className="font-semibold text-indigo-600">free account</span> to continue generating unlimited documents and unlock premium features.
        </p>
        
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">What you'll get (FREE):</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited documents</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Document history</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>AI enhancements</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Priority support</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onRegister}
          className="w-full bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl mb-4"
        >
          Create Free Account
        </button>
        
        {!showSkip && (
          <button
            onClick={() => setShowSkip(true)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Other options
          </button>
        )}
        
        {showSkip && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              Want to continue without an account?
            </p>
            <a
              href="/"
              className="inline-block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Start over (clears your session)
            </a>
          </div>
        )}
      </div>
    </div>
  );
}