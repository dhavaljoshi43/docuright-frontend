'use client';

import { useState } from 'react';
import { generatePdf } from '@/lib/api';

interface NdaFormData {
  effectiveDate: string;
  agreementCity: string;
  agreementState: string;
  firstPartyName: string;
  firstPartyRepresentativeName: string;
  firstPartyAddress: string;
  secondPartyName: string;
  secondPartyRepresentativeName: string;
  secondPartyAddress: string;
  purposeOfNDA: string;
}

const totalSteps = 3;

export function NdaForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<NdaFormData>({
    effectiveDate: '',
    agreementCity: '',
    agreementState: '',
    firstPartyName: '',
    firstPartyRepresentativeName: '',
    firstPartyAddress: '',
    secondPartyName: '',
    secondPartyRepresentativeName: '',
    secondPartyAddress: '',
    purposeOfNDA: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const progress = (step / totalSteps) * 100;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const blob = await generatePdf('nda', formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NDA_Document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">NDA Generator</h1>
        <p className="text-gray-600 mb-4 text-center">
          Fill in the details below to generate your Non-Disclosure Agreement.
        </p>
        {/* Progress Bar */}
        <div className="mb-6 w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-width ease-in-out duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Step 1: Party Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Party Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Party Name
                </label>
                <input type="text" name="firstPartyName" required value={formData.firstPartyName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Party Representative
                </label>
                <input type="text" name="firstPartyRepresentativeName" required value={formData.firstPartyRepresentativeName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Party Address
                </label>
                <input type="text" name="firstPartyAddress" required value={formData.firstPartyAddress} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Second Party Name
                </label>
                <input type="text" name="secondPartyName" required value={formData.secondPartyName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Second Party Representative
                </label>
                <input type="text" name="secondPartyRepresentativeName" required value={formData.secondPartyRepresentativeName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Second Party Address
                </label>
                <input type="text" name="secondPartyAddress" required value={formData.secondPartyAddress} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          )}
          {/* Step 2: Agreement Terms */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Agreement Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Effective Date
                </label>
                <input type="date" name="effectiveDate" required value={formData.effectiveDate} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Agreement City
                </label>
                <input type="text" name="agreementCity" required value={formData.agreementCity} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Agreement State
                </label>
                <input type="text" name="agreementState" required value={formData.agreementState} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purpose of NDA
                </label>
                <textarea name="purposeOfNDA" rows={2} required value={formData.purposeOfNDA} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          )}
          {/* Step 3: Review & Download */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Review & Download</h2>
              <div className="bg-gray-50 border rounded p-4 mb-4 text-sm">
                <p className="font-semibold">First Party:</p>
                {formData.firstPartyName} ({formData.firstPartyRepresentativeName}), {formData.firstPartyAddress}
                <p className="font-semibold mt-2">Second Party:</p>
                {formData.secondPartyName} ({formData.secondPartyRepresentativeName}), {formData.secondPartyAddress}
                <p className="font-semibold mt-2">Effective Date:</p>
                {formData.effectiveDate}
                <p className="font-semibold mt-2">Agreement City/State:</p>
                {formData.agreementCity}, {formData.agreementState}
                <p className="font-semibold mt-2">Purpose:</p>
                {formData.purposeOfNDA}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">Success! Your document has been downloaded.</p>}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >Back</button>
            )}
            {step < totalSteps && (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >Next</button>
            )}
            {step === totalSteps && (
              <button
                type="submit"
                disabled={isLoading}
                className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300">
                {isLoading ? 'Generating...' : 'Generate and Download PDF'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
