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
  // NEW: AI Enhancement fields
  useAIEnhancements: boolean;
  aiEnhancements: {
    enhanceConfidentialityDefinition: boolean;
    enhanceNonDisclosureObligations: boolean;
    enhanceProtectionMeasures: boolean;
    industryType: string;
    riskLevel: string;
    jurisdiction: string;
    specificConcerns: string[];
  };
}

const totalSteps = 4; // Added one more step for AI options

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
    useAIEnhancements: false,
    aiEnhancements: {
      enhanceConfidentialityDefinition: false,
      enhanceNonDisclosureObligations: false,
      enhanceProtectionMeasures: false,
      industryType: '',
      riskLevel: 'MEDIUM',
      jurisdiction: 'INDIA',
      specificConcerns: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aiPreview, setAiPreview] = useState<any>(null);

  const progress = (step / totalSteps) * 100;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('ai.')) {
      const aiField = name.replace('ai.', '');
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
          ...prev,
          aiEnhancements: {
            ...prev.aiEnhancements,
            [aiField]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          aiEnhancements: {
            ...prev.aiEnhancements,
            [aiField]: value
          }
        }));
      }
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const previewAIContent = async () => {
    if (!formData.useAIEnhancements) return;
    
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/nda/preview-ai-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const preview = await response.json();
        setAiPreview(preview);
      }
    } catch (err) {
      console.error('Failed to preview AI content:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">AI-Powered NDA Generator</h1>
        <p className="text-gray-600 mb-4 text-center">
          Fill in the details below to generate your AI-enhanced Non-Disclosure Agreement.
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
          {/* Step 1: Party Details - Same as before */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Party Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Party Name</label>
                <input type="text" name="firstPartyName" required value={formData.firstPartyName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Party Representative</label>
                <input type="text" name="firstPartyRepresentativeName" required value={formData.firstPartyRepresentativeName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Party Address</label>
                <input type="text" name="firstPartyAddress" required value={formData.firstPartyAddress} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Second Party Name</label>
                <input type="text" name="secondPartyName" required value={formData.secondPartyName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Second Party Representative</label>
                <input type="text" name="secondPartyRepresentativeName" required value={formData.secondPartyRepresentativeName} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Second Party Address</label>
                <input type="text" name="secondPartyAddress" required value={formData.secondPartyAddress} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          )}

          {/* Step 2: Agreement Terms - Same as before */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">Agreement Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                <input type="date" name="effectiveDate" required value={formData.effectiveDate} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Agreement City</label>
                <input type="text" name="agreementCity" required value={formData.agreementCity} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Agreement State</label>
                <input type="text" name="agreementState" required value={formData.agreementState} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Purpose of NDA</label>
                <textarea name="purposeOfNDA" rows={2} required value={formData.purposeOfNDA} onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          )}

          {/* NEW Step 3: AI Enhancement Options */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">AI Enhancement Options</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-800 mb-2">🤖 Make your NDA smarter with AI</h3>
                <p className="text-sm text-blue-600">
                  Our AI can customize legal sections based on your industry and risk level for better protection.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="useAIEnhancements"
                  checked={formData.useAIEnhancements}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  Enable AI-powered legal enhancements (Free)
                </label>
              </div>

              {formData.useAIEnhancements && (
                <div className="ml-6 space-y-4 border-l-2 border-indigo-200 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry Type</label>
                    <select
                      name="ai.industryType"
                      value={formData.aiEnhancements.industryType}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="">Select Industry</option>
                      <option value="TECHNOLOGY">Technology/Software</option>
                      <option value="HEALTHCARE">Healthcare</option>
                      <option value="FINANCE">Finance/Banking</option>
                      <option value="MANUFACTURING">Manufacturing</option>
                      <option value="CONSULTING">Consulting</option>
                      <option value="RETAIL">Retail/E-commerce</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                    <select
                      name="ai.riskLevel"
                      value={formData.aiEnhancements.riskLevel}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="LOW">Low Risk</option>
                      <option value="MEDIUM">Medium Risk</option>
                      <option value="HIGH">High Risk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose sections to enhance:</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="ai.enhanceConfidentialityDefinition"
                          checked={formData.aiEnhancements.enhanceConfidentialityDefinition}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <label className="ml-2 text-sm text-gray-600">Enhanced Confidentiality Definition</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="ai.enhanceNonDisclosureObligations"
                          checked={formData.aiEnhancements.enhanceNonDisclosureObligations}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <label className="ml-2 text-sm text-gray-600">Stronger Non-Disclosure Obligations</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="ai.enhanceProtectionMeasures"
                          checked={formData.aiEnhancements.enhanceProtectionMeasures}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <label className="ml-2 text-sm text-gray-600">Industry-Specific Protection Measures</label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={previewAIContent}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
                  >
                    {isLoading ? 'Generating Preview...' : 'Preview AI Enhancements'}
                  </button>

                  {aiPreview && (
                    <div className="mt-4 p-4 bg-gray-50 rounded border">
                      <h4 className="font-medium text-gray-800 mb-2">AI Preview:</h4>
                      <div className="text-xs text-gray-600 max-h-32 overflow-y-auto">
                        {Object.entries(aiPreview).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <strong>{key}:</strong> {String(value).substring(0, 200)}...
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Download - Updated step number */}
          {step === 4 && (
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
                
                {formData.useAIEnhancements && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="font-semibold text-blue-800">AI Enhancements Enabled:</p>
                    <p className="text-blue-600 text-xs">
                      Industry: {formData.aiEnhancements.industryType} | Risk: {formData.aiEnhancements.riskLevel}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-2">Success! Your AI-enhanced document has been downloaded.</p>}

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
                {isLoading ? 'Generating...' : 'Generate AI-Enhanced PDF'}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}