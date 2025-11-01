import React, { useState, useCallback, useEffect } from 'react';
import {
  FileText, Users, MapPin, Calendar, Building, Sparkles,
  Save, Eye, Download, ChevronRight, AlertCircle, Check,
  Zap, Shield, Scale, ArrowLeft, X
} from 'lucide-react';

interface ModernNdaFormProps {
  onBack?: () => void;
}

interface FormData {
  effectiveDate: string;
  agreementCity: string;
  agreementState: string;
  firstPartyName: string;
  secondPartyName: string;
  purposeOfNDA: string;
  firstPartyRepresentativeName: string;
  firstPartyAddress: string;
  secondPartyRepresentativeName: string;
  secondPartyAddress: string;
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

// Debounce utility
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

const ModernNDAForm: React.FC<ModernNdaFormProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    effectiveDate: '',
    agreementCity: '',
    agreementState: '',
    firstPartyName: '',
    secondPartyName: '',
    purposeOfNDA: '',
    firstPartyRepresentativeName: '',
    firstPartyAddress: '',
    secondPartyRepresentativeName: '',
    secondPartyAddress: '',
    useAIEnhancements: false,
    aiEnhancements: {
      enhanceConfidentialityDefinition: false,
      enhanceNonDisclosureObligations: false,
      enhanceProtectionMeasures: false,
      industryType: '',
      riskLevel: 'MEDIUM',
      jurisdiction: 'INDIA'
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState<boolean>(false);
  const [previewStats, setPreviewStats] = useState({ wordCount: 0, pageCount: 0 });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('accessToken');
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIEnhancementChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      aiEnhancements: {
        ...prev.aiEnhancements,
        [field]: value
      }
    }));
  };

  const steps = [
    { number: 1, title: 'Agreement Details', icon: FileText },
    { number: 2, title: 'Party Information', icon: Users },
    { number: 3, title: 'AI Enhancements', icon: Sparkles },
    { number: 4, title: 'Review & Generate', icon: Check }
  ];

  const industries = [
    { label: 'Technology', value: 'TECHNOLOGY' },
    { label: 'Healthcare', value: 'HEALTHCARE' },
    { label: 'Finance', value: 'FINANCE' },
    { label: 'Manufacturing', value: 'MANUFACTURING' },
    { label: 'Retail', value: 'RETAIL' },
    { label: 'Real Estate', value: 'REAL_ESTATE' },
    { label: 'Consulting', value: 'CONSULTING' },
    { label: 'Other', value: 'OTHER' }
  ];

  const riskLevels = [
    { value: 'LOW', label: 'Low Risk', color: 'success', desc: 'Standard protection' },
    { value: 'MEDIUM', label: 'Medium Risk', color: 'warning', desc: 'Enhanced protection' },
    { value: 'HIGH', label: 'High Risk', color: 'danger', desc: 'Maximum protection' }
  ];

  // Check if minimum data is available for preview
  const hasMinimumData = (data: FormData) => {
    return data.firstPartyName && data.secondPartyName && data.purposeOfNDA;
  };

  // Update preview
  const updatePreview = async (data: FormData) => {
    if (!hasMinimumData(data)) {
      setPreviewHtml('');
      return;
    }

    setIsLoadingPreview(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = getAuthToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Transform data to match backend API format
      const apiData = {
        ...data,
        aiEnhancements: {
          ...data.aiEnhancements,
          // Ensure industryType is in uppercase format
          industryType: data.aiEnhancements.industryType || ''
        }
      };

      const response = await fetch(`${apiUrl}/api/preview/nda`, {
        method: 'POST',
        headers,
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.json();
        setPreviewHtml(result.htmlContent);
        setPreviewStats({
          wordCount: result.wordCount,
          pageCount: result.pageCount
        });
      } else {
        console.error('Preview failed:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (err) {
      console.error('Preview update failed:', err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Debounced preview update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedPreviewUpdate = useCallback(
    debounce((data: FormData) => {
      if (showPreview && hasMinimumData(data)) {
        updatePreview(data);
      }
    }, 800),
    [showPreview]
  );

  // Auto-update preview when form data changes
  useEffect(() => {
    if (showPreview) {
      debouncedPreviewUpdate(formData);
    }
  }, [formData, showPreview, debouncedPreviewUpdate]);

  // Toggle preview pane
  const togglePreview = () => {
    const newShowPreview = !showPreview;
    setShowPreview(newShowPreview);
    if (newShowPreview && hasMinimumData(formData)) {
      updatePreview(formData);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('NDA Generated Successfully!');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Form Section */}
      <div className={`${showPreview ? 'w-1/2' : 'w-full'} transition-all duration-300 overflow-y-auto`}>
        <div className="max-w-3xl mx-auto p-6">
          <div className="glass-card p-8 animate-fade-in">
            {onBack && (
              <button
                onClick={onBack}
                className="btn-ghost mb-6 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            )}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-gradient mb-2">
                  AI-Powered NDA
                </h1>
                <p className="text-dark-600 text-sm">
                  Fill in the details to generate your professional NDA
                </p>
              </div>
              <button
                onClick={togglePreview}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all text-white"
                style={showPreview 
                  ? { background: 'linear-gradient(to right, #ef4444 0%, #dc2626 100%)' }
                  : { background: 'linear-gradient(to right, #0ea5e9 0%, #0284c7 100%)' }
                }
              >
                {showPreview ? (
                  <>
                    <X className="w-4 h-4" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Preview
                  </>
                )}
              </button>
            </div>
            
            {showPreview && previewStats.wordCount > 0 && (
              <div className="mb-6 glass-card p-4 border border-primary-200 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="flex justify-between text-sm font-medium">
                  <span className="flex items-center gap-2 text-primary-700">
                    <FileText className="w-4 h-4" />
                    {previewStats.wordCount} words
                  </span>
                  <span className="flex items-center gap-2 text-secondary-700">
                    <Scale className="w-4 h-4" />
                    {previewStats.pageCount} pages
                  </span>
                  <span className="flex items-center gap-2 text-success-700">
                    {isLoadingPreview && (
                      <span className="inline-block w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></span>
                    )}
                    <Sparkles className="w-4 h-4" />
                    Live Preview
                  </span>
                </div>
              </div>
            )}
            
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="min-w-[32px] w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)' }}
                  >
                    {currentStep}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-dark-800">Step {currentStep} of 4</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-dark-600">
                  {Math.round((currentStep / 4) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-dark-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(currentStep / 4) * 100}%`,
                    background: 'linear-gradient(to right, #0ea5e9 0%, #d946ef 100%)'
                  }}
                />
              </div>
            </div>

            {/* Step 1: Agreement Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
                  >
                    <FileText className="w-7 h-7 text-white" strokeWidth={3} fill="white" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-900">Agreement Details</h2>
                </div>
                
                <div className="w-full">
                  <label className="block text-sm font-semibold text-dark-700 mb-2">Effective Date *</label>
                  <div className="relative w-full">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => handleChange('effectiveDate', e.target.value)}
                      className="input-field w-full pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-dark-700 mb-2">Agreement City *</label>
                    <div className="relative w-full">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
                      <input
                        type="text"
                        placeholder="e.g., Ahmedabad"
                        value={formData.agreementCity}
                        onChange={(e) => handleChange('agreementCity', e.target.value)}
                        className="input-field w-full pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-semibold text-dark-700 mb-2">Agreement State *</label>
                    <div className="relative w-full">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
                      <input
                        type="text"
                        placeholder="e.g., Gujarat"
                        value={formData.agreementState}
                        onChange={(e) => handleChange('agreementState', e.target.value)}
                        className="input-field w-full pl-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-semibold text-dark-700 mb-2">Purpose of NDA *</label>
                  <textarea
                    placeholder="Describe the purpose of this agreement..."
                    value={formData.purposeOfNDA}
                    onChange={(e) => handleChange('purposeOfNDA', e.target.value)}
                    className="input-field w-full min-h-[120px] resize-none"
                    required
                  />
                  <p className="text-xs text-dark-500 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Example: "Exploring potential business partnership in AI technology"
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Party Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #d946ef 0%, #c026d3 100%)' }}
                  >
                    <Users className="w-7 h-7 text-white" strokeWidth={3} fill="white" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-900">Party Information</h2>
                </div>

                {/* First Party */}
                <div className="glass-card p-6 border-l-4 border-primary-500 bg-gradient-to-r from-primary-50/50 to-transparent w-full">
                  <h3 className="font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    First Party (You)
                  </h3>
                  
                  <div className="space-y-4 w-full">
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-dark-700 mb-2">Company/Individual Name *</label>
                      <div className="relative w-full">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                        <input
                          type="text"
                          placeholder="e.g., Acme Corporation"
                          value={formData.firstPartyName}
                          onChange={(e) => handleChange('firstPartyName', e.target.value)}
                          className="input-field w-full pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-semibold text-dark-700 mb-2">Representative Name *</label>
                      <div className="relative w-full">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                        <input
                          type="text"
                          placeholder="e.g., John Doe"
                          value={formData.firstPartyRepresentativeName}
                          onChange={(e) => handleChange('firstPartyRepresentativeName', e.target.value)}
                          className="input-field w-full pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-semibold text-dark-700 mb-2">Address *</label>
                      <textarea
                        placeholder="Complete business address including city, state, and PIN"
                        value={formData.firstPartyAddress}
                        onChange={(e) => handleChange('firstPartyAddress', e.target.value)}
                        className="input-field w-full min-h-[80px] resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Second Party */}
                <div className="glass-card p-6 border-l-4 border-secondary-500 bg-gradient-to-r from-secondary-50/50 to-transparent w-full">
                  <h3 className="font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Second Party
                  </h3>
                  
                  <div className="space-y-4 w-full">
                    <div className="w-full">
                      <label className="block text-sm font-semibold text-dark-700 mb-2">Company/Individual Name *</label>
                      <div className="relative w-full">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
                        <input
                          type="text"
                          placeholder="e.g., Tech Solutions Ltd"
                          value={formData.secondPartyName}
                          onChange={(e) => handleChange('secondPartyName', e.target.value)}
                          className="input-field w-full pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-semibold text-dark-700 mb-2">Representative Name *</label>
                      <div className="relative w-full">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
                        <input
                          type="text"
                          placeholder="e.g., Jane Smith"
                          value={formData.secondPartyRepresentativeName}
                          onChange={(e) => handleChange('secondPartyRepresentativeName', e.target.value)}
                          className="input-field w-full pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-semibold text-dark-700 mb-2">Address *</label>
                      <textarea
                        placeholder="Complete business address including city, state, and PIN"
                        value={formData.secondPartyAddress}
                        onChange={(e) => handleChange('secondPartyAddress', e.target.value)}
                        className="input-field w-full min-h-[80px] resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: AI Enhancements */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                  >
                    <Sparkles className="w-7 h-7 text-white" strokeWidth={3} fill="white" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-900">AI Enhancements</h2>
                </div>

                <div className="glass-card p-6 border border-warning-200 bg-gradient-to-br from-warning-50 to-primary-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-900 text-lg">Enable AI-Powered Enhancements</h3>
                        <p className="text-sm text-dark-600 mt-1">
                          Industry-specific, legally sound clauses tailored to your needs
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={formData.useAIEnhancements}
                        onChange={(e) => handleChange('useAIEnhancements', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div 
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.useAIEnhancements ? '' : 'bg-dark-200'}`}
                        style={formData.useAIEnhancements ? { background: 'linear-gradient(to right, #0ea5e9 0%, #d946ef 100%)' } : {}}
                      >
                        <div 
                          className={`absolute top-0.5 left-[2px] bg-white rounded-full h-6 w-6 transition-all shadow-md ${formData.useAIEnhancements ? 'translate-x-7' : ''}`}
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {formData.useAIEnhancements && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-dark-700 mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Industry Type
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {industries.map(industry => {
                          const isSelected = formData.aiEnhancements.industryType === industry.value;
                          return (
                            <button
                              key={industry.value}
                              type="button"
                              onClick={() => handleAIEnhancementChange('industryType', industry.value)}
                              className={`p-4 rounded-xl border-2 transition-all text-sm font-semibold shadow-sm hover:shadow-md cursor-pointer ${
                                isSelected
                                  ? 'text-primary-700 border-primary-500'
                                  : 'border-dark-200 bg-white hover:border-primary-300 text-dark-700'
                              }`}
                              style={isSelected ? {
                                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                                boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)'
                              } : {}}
                            >
                              {industry.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-dark-700 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Protection Level
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {riskLevels.map(level => {
                          const isSelected = formData.aiEnhancements.riskLevel === level.value;
                          const colorMap: { [key: string]: { border: string; bg: string; text: string; bgGradient: string } } = {
                            success: {
                              border: '#16a34a',
                              bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                              text: '#15803d',
                              bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                            },
                            warning: {
                              border: '#d97706',
                              bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                              text: '#b45309',
                              bgGradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                            },
                            danger: {
                              border: '#dc2626',
                              bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                              text: '#b91c1c',
                              bgGradient: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                            }
                          };
                          const colors = colorMap[level.color] || colorMap.warning;
                          
                          return (
                            <button
                              key={level.value}
                              type="button"
                              onClick={() => handleAIEnhancementChange('riskLevel', level.value)}
                              className={`p-5 rounded-xl border-2 transition-all text-left shadow-sm hover:shadow-md cursor-pointer ${
                                isSelected
                                  ? ''
                                  : 'border-dark-200 bg-white hover:border-dark-300'
                              }`}
                              style={isSelected ? {
                                borderColor: colors.border,
                                background: colors.bgGradient,
                                boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)'
                              } : {}}
                            >
                              <div 
                                className="font-bold text-lg mb-1"
                                style={isSelected ? { color: colors.text } : { color: '#0f172a' }}
                              >
                                {level.label}
                              </div>
                              <div className="text-sm text-dark-600">{level.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-dark-700 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Sections to Enhance
                      </label>
                      <div className="space-y-3">
                        <div className="glass-card p-4 border border-primary-200 rounded-xl">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.aiEnhancements.enhanceConfidentialityDefinition}
                              onChange={(e) => handleAIEnhancementChange('enhanceConfidentialityDefinition', e.target.checked)}
                              className="w-5 h-5 text-primary-600 border-dark-300 rounded focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-dark-900">Enhanced Confidentiality Definition</div>
                              <div className="text-sm text-dark-600 mt-1">More comprehensive definition of what constitutes confidential information</div>
                            </div>
                          </label>
                        </div>
                        <div className="glass-card p-4 border border-primary-200 rounded-xl">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.aiEnhancements.enhanceNonDisclosureObligations}
                              onChange={(e) => handleAIEnhancementChange('enhanceNonDisclosureObligations', e.target.checked)}
                              className="w-5 h-5 text-primary-600 border-dark-300 rounded focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-dark-900">Stronger Non-Disclosure Obligations</div>
                              <div className="text-sm text-dark-600 mt-1">Enhanced legal obligations and restrictions on disclosure</div>
                            </div>
                          </label>
                        </div>
                        <div className="glass-card p-4 border border-primary-200 rounded-xl">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.aiEnhancements.enhanceProtectionMeasures}
                              onChange={(e) => handleAIEnhancementChange('enhanceProtectionMeasures', e.target.checked)}
                              className="w-5 h-5 text-primary-600 border-dark-300 rounded focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-dark-900">Industry-Specific Protection Measures</div>
                              <div className="text-sm text-dark-600 mt-1">Tailored protection measures based on your selected industry</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                  >
                    <Check className="w-7 h-7 text-white" strokeWidth={3} fill="white" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-900">Review & Generate</h2>
                </div>

                <div className="glass-card p-6 space-y-5 bg-gradient-to-br from-white to-primary-50/30">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-dark-800">First Party:</span>
                      <p className="text-dark-700 mt-1">{formData.firstPartyName}</p>
                      <p className="text-sm text-dark-600">Representative: {formData.firstPartyRepresentativeName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-secondary-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-dark-800">Second Party:</span>
                      <p className="text-dark-700 mt-1">{formData.secondPartyName}</p>
                      <p className="text-sm text-dark-600">Representative: {formData.secondPartyRepresentativeName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-warning-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-dark-800">Effective Date:</span>
                      <p className="text-dark-700 mt-1">{formData.effectiveDate || 'Not set'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-success-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-dark-800">Location:</span>
                      <p className="text-dark-700 mt-1">{formData.agreementCity}, {formData.agreementState}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-dark-800">Purpose:</span>
                      <p className="text-dark-700 mt-1">{formData.purposeOfNDA}</p>
                    </div>
                  </div>

                  {formData.useAIEnhancements && (
                    <div className="mt-4 glass-card p-4 bg-gradient-to-r from-warning-50 to-primary-50 border-l-4 border-warning-500">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-warning-600" />
                        <p className="font-bold text-warning-900">AI Enhancements Enabled</p>
                      </div>
                      <div className="space-y-2 text-sm text-dark-700">
                        <p>
                          <span className="font-semibold">Industry:</span> {
                            industries.find(i => i.value === formData.aiEnhancements.industryType)?.label || formData.aiEnhancements.industryType || 'Not specified'
                          }
                        </p>
                        <p>
                          <span className="font-semibold">Risk Level:</span> {
                            riskLevels.find(r => r.value === formData.aiEnhancements.riskLevel)?.label || formData.aiEnhancements.riskLevel
                          }
                        </p>
                        <p>
                          <span className="font-semibold">Jurisdiction:</span> {formData.aiEnhancements.jurisdiction || 'INDIA'}
                        </p>
                        {(formData.aiEnhancements.enhanceConfidentialityDefinition || 
                          formData.aiEnhancements.enhanceNonDisclosureObligations || 
                          formData.aiEnhancements.enhanceProtectionMeasures) && (
                          <div className="mt-2 pt-2 border-t border-warning-200">
                            <p className="font-semibold mb-1">Enhanced Sections:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              {formData.aiEnhancements.enhanceConfidentialityDefinition && <li>Enhanced Confidentiality Definition</li>}
                              {formData.aiEnhancements.enhanceNonDisclosureObligations && <li>Stronger Non-Disclosure Obligations</li>}
                              {formData.aiEnhancements.enhanceProtectionMeasures && <li>Industry-Specific Protection Measures</li>}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-dark-200">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-ghost flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="btn-primary ml-auto flex items-center gap-2 shadow-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary ml-auto flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate PDF
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Pane */}
      {showPreview && (
        <div className="w-1/2 bg-white/80 backdrop-blur-xl border-l border-primary-200 overflow-hidden shadow-2xl">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-primary-200" style={{ background: 'linear-gradient(to right, #f0f9ff 0%, #fdf4ff 100%)' }}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)' }}
                >
                  <Eye className="w-6 h-6 text-white" strokeWidth={2.5} fill="white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900 flex items-center gap-2">
                    Live Preview
                  </h3>
                  <p className="text-sm text-dark-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Updates as you type
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              {previewHtml ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }} 
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center glass-card p-8 max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-primary-600" />
                    </div>
                    <p className="font-bold text-lg text-dark-900 mb-2">Fill in the form to see preview</p>
                    <p className="text-sm text-dark-600">Minimum required: Party names and purpose</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernNDAForm;