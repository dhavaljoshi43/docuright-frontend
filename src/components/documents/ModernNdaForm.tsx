import React, { useState } from 'react';
import {
  FileText, Users, MapPin, Calendar, Building, Sparkles,
  Save, Eye, Download, ChevronRight, AlertCircle, Check,
  Zap, Shield, Scale, ArrowLeft
} from 'lucide-react';

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
    industryType: string;
    riskLevel: string;
    jurisdiction: string;
  };
}

interface RiskLevel {
  value: string;
  label: string;
  color: string;
  desc: string;
}

interface ModernNDAFormProps {
  onBack?: () => void;
}

const ModernNDAForm: React.FC<ModernNDAFormProps> = ({ onBack }) => {
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
      industryType: 'Technology',
      riskLevel: 'MEDIUM',
      jurisdiction: 'INDIA'
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIEnhancementChange = (field: string, value: string) => {
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

  const industries: string[] = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 
    'Retail', 'Real Estate', 'Consulting', 'Other'
  ];

  const riskLevels: RiskLevel[] = [
    { value: 'LOW', label: 'Low Risk', color: 'success', desc: 'Standard protection' },
    { value: 'MEDIUM', label: 'Medium Risk', color: 'warning', desc: 'Enhanced protection' },
    { value: 'HIGH', label: 'High Risk', color: 'danger', desc: 'Maximum protection' }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('NDA Generated Successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-full w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card p-8 mb-8 animate-slide-down">
          {onBack && (
            <button 
              onClick={onBack}
              className="btn-ghost flex items-center gap-2 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          )}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">
                Generate NDA Document
              </h1>
              <p className="text-dark-600 text-lg">
                AI-powered document generation with smart defaults
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn-ghost flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Draft
              </button>
              <button className="btn-outline flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Preview
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-glow'
                      : 'bg-dark-100 text-dark-400'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs text-dark-600">Step {step.number}</div>
                    <div className={`font-semibold ${
                      currentStep >= step.number ? 'text-dark-900' : 'text-dark-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded transition-all duration-500 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                      : 'bg-dark-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="glass-card p-8 animate-scale-in">
          {/* Step 1: Agreement Details */}
          {currentStep === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-7 h-7 text-primary-600" />
                Agreement Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Effective Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => handleChange('effectiveDate', e.target.value)}
                      className="input-modern pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Agreement City *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Ahmedabad"
                      value={formData.agreementCity}
                      onChange={(e) => handleChange('agreementCity', e.target.value)}
                      className="input-modern pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Agreement State *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Gujarat"
                      value={formData.agreementState}
                      onChange={(e) => handleChange('agreementState', e.target.value)}
                      className="input-modern pl-12"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Purpose of NDA *
                  </label>
                  <textarea
                    placeholder="Describe the purpose of this agreement..."
                    value={formData.purposeOfNDA}
                    onChange={(e) => handleChange('purposeOfNDA', e.target.value)}
                    className="input-modern min-h-[100px] resize-none"
                    required
                  />
                  <p className="text-sm text-dark-600 mt-2">
                    Example: "Exploring potential business partnership in AI technology"
                  </p>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Pro Tips</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Be specific about the location and date for legal validity</li>
                      <li>• Clearly state the purpose to avoid ambiguity</li>
                      <li>• Use today's date or a future date for effectiveness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Party Information */}
          {currentStep === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-7 h-7 text-primary-600" />
                Party Information
              </h2>

              {/* First Party */}
              <div className="mb-8 p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border border-primary-200">
                <h3 className="font-bold text-lg mb-4 text-primary-900">First Party (You)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-2">
                      Company/Individual Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                      <input
                        type="text"
                        placeholder="Acme Corporation"
                        value={formData.firstPartyName}
                        onChange={(e) => handleChange('firstPartyName', e.target.value)}
                        className="input-modern pl-12 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-2">
                      Representative Name *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.firstPartyRepresentativeName}
                        onChange={(e) => handleChange('firstPartyRepresentativeName', e.target.value)}
                        className="input-modern pl-12 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-dark-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      placeholder="123 Business Street, City, State, PIN"
                      value={formData.firstPartyAddress}
                      onChange={(e) => handleChange('firstPartyAddress', e.target.value)}
                      className="input-modern min-h-[80px] resize-none bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Second Party */}
              <div className="p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl border border-secondary-200">
                <h3 className="font-bold text-lg mb-4 text-secondary-900">Second Party</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-2">
                      Company/Individual Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                      <input
                        type="text"
                        placeholder="Tech Solutions Ltd"
                        value={formData.secondPartyName}
                        onChange={(e) => handleChange('secondPartyName', e.target.value)}
                        className="input-modern pl-12 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-2">
                      Representative Name *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={formData.secondPartyRepresentativeName}
                        onChange={(e) => handleChange('secondPartyRepresentativeName', e.target.value)}
                        className="input-modern pl-12 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-dark-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      placeholder="456 Partner Avenue, City, State, PIN"
                      value={formData.secondPartyAddress}
                      onChange={(e) => handleChange('secondPartyAddress', e.target.value)}
                      className="input-modern min-h-[80px] resize-none bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: AI Enhancements */}
          {currentStep === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-primary-600" />
                AI Enhancements
              </h2>

              {/* Toggle AI */}
              <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 text-purple-900">Enable AI-Powered Enhancements</h3>
                      <p className="text-sm text-purple-800 mb-4">
                        Let our AI generate industry-specific, legally sound clauses tailored to your needs
                      </p>
                      <div className="flex items-center gap-4">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-purple-700">Enhanced legal protection</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <Scale className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-purple-700">Jurisdiction-specific compliance</span>
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.useAIEnhancements}
                      onChange={(e) => handleChange('useAIEnhancements', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500"></div>
                  </label>
                </div>
              </div>

              {formData.useAIEnhancements && (
                <div className="space-y-6 animate-slide-down">
                  {/* Industry Type */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-3">
                      Industry Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {industries.map(industry => (
                        <button
                          key={industry}
                          onClick={() => handleAIEnhancementChange('industryType', industry)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.aiEnhancements.industryType === industry
                              ? 'border-primary-500 bg-primary-50 shadow-glow'
                              : 'border-dark-200 bg-white hover:border-primary-300'
                          }`}
                        >
                          <div className="font-semibold text-dark-900">{industry}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-3">
                      Protection Level
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {riskLevels.map(level => (
                        <button
                          key={level.value}
                          onClick={() => handleAIEnhancementChange('riskLevel', level.value)}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                            formData.aiEnhancements.riskLevel === level.value
                              ? `border-${level.color}-500 bg-${level.color}-50 shadow-glow`
                              : 'border-dark-200 bg-white hover:border-dark-300'
                          }`}
                        >
                          <div className="font-bold text-lg mb-1">{level.label}</div>
                          <div className="text-sm text-dark-600">{level.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Jurisdiction */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-700 mb-2">
                      Jurisdiction
                    </label>
                    <select
                      value={formData.aiEnhancements.jurisdiction}
                      onChange={(e) => handleAIEnhancementChange('jurisdiction', e.target.value)}
                      className="input-modern"
                    >
                      <option value="INDIA">India</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="EU">European Union</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Check className="w-7 h-7 text-success-600" />
                Review & Generate
              </h2>

              <div className="bg-gradient-to-br from-success-50 to-emerald-50 p-8 rounded-2xl border border-success-200">
                <h3 className="font-bold text-xl mb-6 text-success-900">Document Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-dark-600 mb-1">Effective Date</div>
                    <div className="font-semibold text-dark-900">{formData.effectiveDate || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-600 mb-1">Location</div>
                    <div className="font-semibold text-dark-900">
                      {formData.agreementCity || 'Not set'}, {formData.agreementState || 'Not set'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-dark-600 mb-1">Purpose</div>
                    <div className="font-semibold text-dark-900">{formData.purposeOfNDA || 'Not set'}</div>
                  </div>
                </div>

                <div className="h-px bg-success-200 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-dark-600 mb-2">First Party</div>
                    <div className="font-bold text-dark-900">{formData.firstPartyName || 'Not set'}</div>
                    <div className="text-sm text-dark-700">{formData.firstPartyRepresentativeName || 'Not set'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-600 mb-2">Second Party</div>
                    <div className="font-bold text-dark-900">{formData.secondPartyName || 'Not set'}</div>
                    <div className="text-sm text-dark-700">{formData.secondPartyRepresentativeName || 'Not set'}</div>
                  </div>
                </div>

                {formData.useAIEnhancements && (
                  <>
                    <div className="h-px bg-success-200 my-6"></div>
                    <div className="p-4 bg-purple-100 rounded-xl border border-purple-300">
                      <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-purple-900">AI Enhancements Enabled</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-purple-700">Industry</div>
                          <div className="font-semibold text-purple-900">{formData.aiEnhancements.industryType}</div>
                        </div>
                        <div>
                          <div className="text-purple-700">Protection Level</div>
                          <div className="font-semibold text-purple-900">{formData.aiEnhancements.riskLevel}</div>
                        </div>
                        <div>
                          <div className="text-purple-700">Jurisdiction</div>
                          <div className="font-semibold text-purple-900">{formData.aiEnhancements.jurisdiction}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">Before You Generate</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>✓ Review all information for accuracy</li>
                      <li>✓ Ensure all required fields are complete</li>
                      <li>✓ Generated document can be edited before finalizing</li>
                      <li>✓ Consider legal review for high-value agreements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-dark-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Generate NDA
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernNDAForm;