'use client';

import { useState, useEffect, useCallback } from 'react';
import { generatePdf } from '@/lib/api';
import AnonymousTracker from '@/lib/anonymousTracking';
import { RegistrationBanner, RegistrationModal, RegistrationGate } from '@/components/RegistrationPrompts';
import { AuthModal } from '@/components/AuthForms';

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
  useAIEnhancements: boolean;
  aiEnhancements: {
    enhanceConfidentialityDefinition: boolean;
    enhanceNonDisclosureObligations: boolean;
    enhanceProtectionMeasures: boolean;
    industryType: string;
    riskLevel: string;
    jurisdiction: string;
  };
}

const totalSteps = 4;

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

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
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewStats, setPreviewStats] = useState({ wordCount: 0, pageCount: 0 });
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  
  // Registration prompt state
  const [showRegistrationBanner, setShowRegistrationBanner] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showRegistrationGate, setShowRegistrationGate] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const progress = (step / totalSteps) * 100;
  
  // Check for registration gate on component mount
  useEffect(() => {
    if (AnonymousTracker.hasReachedLimit()) {
      setShowRegistrationGate(true);
    }
  }, []);

  const hasMinimumData = (data: NdaFormData) => {
    return data.firstPartyName && data.secondPartyName && data.purposeOfNDA;
  };

  const updatePreview = async (data: NdaFormData) => {
    if (!hasMinimumData(data)) {
      setPreviewHtml('');
      return;
    }

    setIsLoadingPreview(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/preview/nda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setPreviewHtml(result.htmlContent);
        setPreviewStats({
          wordCount: result.wordCount,
          pageCount: result.pageCount
        });
      }
    } catch (err) {
      console.error('Preview update failed:', err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPreviewUpdate = useCallback(
    debounce((data: NdaFormData) => {
      if (showPreview && hasMinimumData(data)) {
        updatePreview(data);
      }
    }, 800),
    [showPreview]
  );

  useEffect(() => {
    if (showPreview) {
      debouncedPreviewUpdate(formData);
    }
  }, [formData, showPreview, debouncedPreviewUpdate]);

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

  const togglePreview = () => {
    const newShowPreview = !showPreview;
    setShowPreview(newShowPreview);
    if (newShowPreview && hasMinimumData(formData)) {
      updatePreview(formData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has reached limit before allowing generation
    if (AnonymousTracker.hasReachedLimit()) {
      setShowRegistrationGate(true);
      return;
    }
    
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
      
      // Track the generation
      AnonymousTracker.trackGeneration('nda', formData);
      
      // Determine which prompt to show
      const promptType = AnonymousTracker.getPromptType();
      
      setTimeout(() => {
        if (promptType === 'banner') {
          setShowRegistrationBanner(true);
        } else if (promptType === 'modal') {
          setShowRegistrationModal(true);
        } else if (promptType === 'gate') {
          setShowRegistrationGate(true);
        }
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = () => {
    setShowAuthModal(true);
    setShowRegistrationBanner(false);
    setShowRegistrationModal(false);
    setShowRegistrationGate(false);
  };
  
  const handleCloseBanner = () => {
    setShowRegistrationBanner(false);
    AnonymousTracker.markPromptSeen('banner');
  };
  
  const handleCloseModal = () => {
    setShowRegistrationModal(false);
    AnonymousTracker.markPromptSeen('modal');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Form Section */}
      <div className={`${showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300 overflow-y-auto`}>
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">AI-Powered NDA</h1>
              <button
                onClick={togglePreview}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  showPreview 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              Fill in the details to generate your NDA
            </p>
            
            {showPreview && previewStats.wordCount > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Words: {previewStats.wordCount}</span>
                  <span>Pages: {previewStats.pageCount}</span>
                  <span className="flex items-center">
                    {isLoadingPreview && (
                      <span className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></span>
                    )}
                    Live Preview
                  </span>
                </div>
              </div>
            )}
            
            <div className="mb-6 w-full">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-2 text-indigo-700">Party Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Party Name</label>
                    <input 
                      type="text" 
                      name="firstPartyName" 
                      required 
                      value={formData.firstPartyName} 
                      onChange={handleChange}
                      placeholder="e.g., Acme Corporation Pvt Ltd"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Party Representative</label>
                    <input 
                      type="text" 
                      name="firstPartyRepresentativeName" 
                      required 
                      value={formData.firstPartyRepresentativeName} 
                      onChange={handleChange}
                      placeholder="e.g., John Doe, Director"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Party Address</label>
                    <input 
                      type="text" 
                      name="firstPartyAddress" 
                      required 
                      value={formData.firstPartyAddress} 
                      onChange={handleChange}
                      placeholder="Complete business address"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Second Party Name</label>
                    <input 
                      type="text" 
                      name="secondPartyName" 
                      required 
                      value={formData.secondPartyName} 
                      onChange={handleChange}
                      placeholder="e.g., Tech Innovations Ltd"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Second Party Representative</label>
                    <input 
                      type="text" 
                      name="secondPartyRepresentativeName" 
                      required 
                      value={formData.secondPartyRepresentativeName} 
                      onChange={handleChange}
                      placeholder="e.g., Jane Smith, CEO"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Second Party Address</label>
                    <input 
                      type="text" 
                      name="secondPartyAddress" 
                      required 
                      value={formData.secondPartyAddress} 
                      onChange={handleChange}
                      placeholder="Complete business address"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-2 text-indigo-700">Agreement Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                    <input 
                      type="date" 
                      name="effectiveDate" 
                      required 
                      value={formData.effectiveDate} 
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agreement City</label>
                    <input 
                      type="text" 
                      name="agreementCity" 
                      required 
                      value={formData.agreementCity} 
                      onChange={handleChange}
                      placeholder="e.g., Mumbai"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Agreement State</label>
                    <input 
                      type="text" 
                      name="agreementState" 
                      required 
                      value={formData.agreementState} 
                      onChange={handleChange}
                      placeholder="e.g., Maharashtra"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purpose of NDA</label>
                    <textarea 
                      name="purposeOfNDA" 
                      rows={3} 
                      required 
                      value={formData.purposeOfNDA} 
                      onChange={handleChange}
                      placeholder="e.g., Evaluation of potential software licensing agreement"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-2 text-indigo-700">AI Enhancement Options</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">Make your NDA smarter with AI</h3>
                    <p className="text-sm text-blue-600">
                      Customize legal sections based on your industry and risk level.
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
                      Enable AI-powered enhancements (Free)
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
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
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
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="LOW">Low Risk</option>
                          <option value="MEDIUM">Medium Risk</option>
                          <option value="HIGH">High Risk</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sections to enhance:</label>
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
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-indigo-700">Review & Download</h2>
                  <div className="bg-gray-50 border rounded p-4 mb-4 text-sm">
                    <p className="font-semibold">First Party:</p>
                    <p className="text-gray-700 mb-2">{formData.firstPartyName} ({formData.firstPartyRepresentativeName})</p>
                    
                    <p className="font-semibold mt-3">Second Party:</p>
                    <p className="text-gray-700 mb-2">{formData.secondPartyName} ({formData.secondPartyRepresentativeName})</p>
                    
                    <p className="font-semibold mt-3">Effective Date:</p>
                    <p className="text-gray-700 mb-2">{formData.effectiveDate}</p>
                    
                    <p className="font-semibold mt-3">Location:</p>
                    <p className="text-gray-700 mb-2">{formData.agreementCity}, {formData.agreementState}</p>
                    
                    <p className="font-semibold mt-3">Purpose:</p>
                    <p className="text-gray-700">{formData.purposeOfNDA}</p>
                    
                    {formData.useAIEnhancements && (
                      <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <p className="font-semibold text-blue-800 text-xs">AI Enhancements Enabled</p>
                        <p className="text-blue-600 text-xs">
                          Industry: {formData.aiEnhancements.industryType || 'Not specified'} | Risk: {formData.aiEnhancements.riskLevel}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {success && <p className="text-green-600 text-sm mb-2">Success! Document downloaded.</p>}

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
                    {isLoading ? 'Generating...' : 'Generate PDF'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="w-1/2 bg-white border-l border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
              <p className="text-sm text-gray-600">Updates as you type</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {previewHtml ? (
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="font-medium">Fill in the form to see preview</p>
                    <p className="text-sm mt-2">Minimum required: Party names and purpose</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Registration Prompts */}
      {showRegistrationBanner && (
        <RegistrationBanner 
          onClose={handleCloseBanner}
          onRegister={handleRegister}
        />
      )}
      
      {showRegistrationModal && (
        <RegistrationModal 
          onClose={handleCloseModal}
          onRegister={handleRegister}
          remainingGenerations={AnonymousTracker.getRemainingGenerations()}
        />
      )}
      
      {showRegistrationGate && (
        <RegistrationGate 
          onRegister={handleRegister}
          totalGenerated={AnonymousTracker.getUserData().generationCount}
        />
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="register"
      />
    </div>
  );
}