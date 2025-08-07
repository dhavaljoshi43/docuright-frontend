'use client';

import { useState } from 'react';
import { generatePdf } from '@/lib/api';

interface OfferLetterFormData {
  offerDate: string;
  officeLocation: string;
  companyName: string;
  candidateName: string;
  jobTitle: string;
  salary: string;
  joiningDate: string;
  probationPeriod: string;
  signatoryName: string;
  purposeOfLetter: string;
}

const totalSteps = 3;

export function OfferLetterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OfferLetterFormData
>({
    offerDate: '',
    officeLocation: '',
    companyName: '',
    candidateName: '',
    jobTitle: '',
    salary: '',
    joiningDate: '',
    probationPeriod: '',
    signatoryName: '',
    purposeOfLetter: '',
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
      const blob = await generatePdf('offer-letter', formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'OfferLetter_Document.pdf';
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
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Offer Letter Generator</h1>
        <p className="text-gray-600 mb-4 text-center">
          Fill in the details below to generate your Customized Offer Letter.
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
          {/* Step 1: Company details and policies */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Company details & policies</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Office Location
                </label>
                <input type="text" name="officeLocation" required value={formData.officeLocation} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Offered by (Signatory Name)
                </label>
                <input type="text" name="signatoryName" required value={formData.signatoryName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Probation Period (In Months)
                </label>
                <input type="text" name="probationPeriod" required value={formData.probationPeriod} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Offer Date
                </label>
                <input type="date" name="offerDate" required value={formData.offerDate} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          )}
          {/* Step 2: Candidate details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Candidate details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Joining Date
                </label>
                <input type="date" name="joiningDate" required value={formData.joiningDate} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Candidate Name
                </label>
                <input type="text" name="candidateName" required value={formData.candidateName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Annual Compensation
                </label>
                <input type="number" name="salary" required value={formData.salary} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                Purpose of Letter
                </label>
                <textarea name="purposeOfLetter" rows={2} required value={formData.purposeOfLetter} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          )}
          {/* Step 3: Review & Download */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Review & Download</h2>
              <div className="bg-gray-50 border rounded p-4 mb-4 text-sm">
                <p className="font-semibold">Company Details:</p>
                Offered By: {formData.signatoryName} of {formData.companyName} at ({formData.officeLocation})
                <p className="font-semibold mt-2">Important dates:</p>
                Offered on: {formData.offerDate} to Join by ({formData.joiningDate})
                <p className="font-semibold mt-2">Candidate details:</p>
                {formData.candidateName} to be designated at {formData.jobTitle}, for Package: {formData.salary} per annum
                <p className="font-semibold mt-2">Purpose:</p>
                {formData.purposeOfLetter}
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
