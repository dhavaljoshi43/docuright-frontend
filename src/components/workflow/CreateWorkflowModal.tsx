import React, { useState } from 'react';
import { 
  X, FileText, Mail, User, Building, ChevronRight, 
  Check, Sparkles, AlertCircle, ArrowLeft
} from 'lucide-react';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // You can update `any` to a stricter type if you wish
}

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    documentId: null,
    workflowType: 'nda',
    secondPartyEmail: '',
    secondPartyName: '',
    secondPartyCompany: '',
    initialParameters: {}
  });

  const workflowTypes = [
    {
      id: 'nda',
      title: 'Non-Disclosure Agreement',
      description: 'Protect confidential information shared between parties',
      icon: '🔒',
      color: 'from-primary-500 to-primary-600'
    },
    {
      id: 'employment_agreement',
      title: 'Employment Agreement',
      description: 'Define terms of employment and responsibilities',
      icon: '👔',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'service_agreement',
      title: 'Service Agreement',
      description: 'Outline service delivery terms and conditions',
      icon: '🤝',
      color: 'from-secondary-500 to-secondary-600'
    }
  ];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-dark-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold text-gradient">
                Create New Workflow
              </h2>
              <p className="text-dark-600 mt-1">
                Step {step} of 3 - {
                  step === 1 ? 'Select Document Type' : 
                  step === 2 ? 'Invite Second Party' : 
                  'Review & Create'
                }
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-dark-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map(s => (
              <div 
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  s <= step 
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
                    : 'bg-dark-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Step 1: Select Document Type */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileText className="w-7 h-7 text-primary-600" />
                Choose Document Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workflowTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => handleChange('workflowType', type.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      formData.workflowType === type.id
                        ? 'border-primary-500 bg-primary-50 shadow-glow'
                        : 'border-dark-200 bg-white hover:border-primary-300 hover:shadow-glass'
                    }`}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                      {type.icon}
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-dark-900">
                      {type.title}
                    </h4>
                    <p className="text-sm text-dark-600">
                      {type.description}
                    </p>
                    {formData.workflowType === type.id && (
                      <div className="mt-4 flex items-center gap-2 text-primary-600">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-2">AI-Powered Workflows</h4>
                    <p className="text-blue-800 text-sm">
                      Our intelligent system will guide both parties through negotiation, suggest compromises, and ensure all critical parameters are addressed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Invite Second Party */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <User className="w-7 h-7 text-primary-600" />
                Invite Second Party
              </h3>
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="email"
                      placeholder="partner@company.com"
                      value={formData.secondPartyEmail}
                      onChange={(e) => handleChange('secondPartyEmail', e.target.value)}
                      className="input-modern pl-12"
                      required
                    />
                  </div>
                  <p className="text-sm text-dark-600 mt-2">
                    They'll receive an invitation to review and collaborate on this document
                  </p>
                </div>
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Contact Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      placeholder="John Smith"
                      value={formData.secondPartyName}
                      onChange={(e) => handleChange('secondPartyName', e.target.value)}
                      className="input-modern pl-12"
                    />
                  </div>
                </div>
                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-dark-700 mb-2">
                    Company Name (Optional)
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                      type="text"
                      placeholder="Tech Solutions Ltd"
                      value={formData.secondPartyCompany}
                      onChange={(e) => handleChange('secondPartyCompany', e.target.value)}
                      className="input-modern pl-12"
                    />
                  </div>
                </div>
                {/* Preview */}
                <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-200">
                  <h4 className="font-bold text-dark-900 mb-4">Invitation Preview</h4>
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <p className="text-dark-700 mb-4">
                      Hi {formData.secondPartyName || '[Name]'},
                    </p>
                    <p className="text-dark-700 mb-4">
                      You've been invited to review and collaborate on a <strong>{workflowTypes.find(t => t.id === formData.workflowType)?.title}</strong>.
                    </p>
                    <p className="text-dark-700 mb-4">
                      Click the link below to get started:
                    </p>
                    <button className="btn-primary text-sm">
                      Accept Invitation & Review Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Create */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Check className="w-7 h-7 text-success-600" />
                Review & Create
              </h3>
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-success-50 to-emerald-50 p-6 rounded-2xl border border-success-200">
                  <h4 className="font-bold text-success-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Workflow Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-success-200">
                      <span className="text-dark-700">Document Type</span>
                      <span className="font-semibold text-dark-900">
                        {workflowTypes.find(t => t.id === formData.workflowType)?.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-success-200">
                      <span className="text-dark-700">Second Party Email</span>
                      <span className="font-semibold text-dark-900">
                        {formData.secondPartyEmail}
                      </span>
                    </div>
                    {formData.secondPartyName && (
                      <div className="flex items-center justify-between py-3 border-b border-success-200">
                        <span className="text-dark-700">Contact Name</span>
                        <span className="font-semibold text-dark-900">
                          {formData.secondPartyName}
                        </span>
                      </div>
                    )}
                    {formData.secondPartyCompany && (
                      <div className="flex items-center justify-between py-3">
                        <span className="text-dark-700">Company</span>
                        <span className="font-semibold text-dark-900">
                          {formData.secondPartyCompany}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* What Happens Next */}
                <div className="bg-white p-6 rounded-2xl border-2 border-dark-200">
                  <h4 className="font-bold text-dark-900 mb-4">What happens next?</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-700 font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-semibold text-dark-900 mb-1">Workflow Created</div>
                        <p className="text-sm text-dark-600">
                          Your workflow will be created with default parameters
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-secondary-700 font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-semibold text-dark-900 mb-1">Invitation Sent</div>
                        <p className="text-sm text-dark-600">
                          Second party receives email invitation with secure link
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0 text-warning-700 font-bold">
                        3
                      </div>
                      <div>
                        <div className="font-semibold text-dark-900 mb-1">Review & Negotiate</div>
                        <p className="text-sm text-dark-600">
                          Both parties can propose changes and discuss terms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0 text-success-700 font-bold">
                        4
                      </div>
                      <div>
                        <div className="font-semibold text-dark-900 mb-1">Final Approval</div>
                        <p className="text-sm text-dark-600">
                          Once agreed, document is ready for signing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* AI Features Notice */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-900 mb-2">AI-Powered Features Included</h4>
                      <ul className="space-y-2 text-sm text-purple-800">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 text-purple-600" />
                          <span>Intelligent conflict resolution suggestions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 text-purple-600" />
                          <span>Automated parameter analysis and recommendations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 text-purple-600" />
                          <span>Legal compliance checks and warnings</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Footer Actions */}
        <div className="p-6 border-t border-dark-200 bg-dark-50/50">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="btn-ghost flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="btn-outline"
              >
                Cancel
              </button>
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={step === 2 && !formData.secondPartyEmail}
                  className="btn-primary flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex items-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Create Workflow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflowModal;
