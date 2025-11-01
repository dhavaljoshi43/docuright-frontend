import React, { useState, type ReactElement } from 'react';
import {
  ArrowLeft, FileText, CheckCircle, XCircle, Clock, Users,
  MessageSquare, Sparkles, Send, AlertTriangle, ThumbsUp,
  ThumbsDown, MoreVertical, Download, Share2, Edit, Eye
} from 'lucide-react';

// Mock data
const workflowData = {
  id: 1,
  documentType: 'Non-Disclosure Agreement',
  status: 'negotiation',
  currentStage: 'first_party_response',
  firstParty: { name: 'Acme Corporation', email: 'legal@acme.com', avatar: 'AC' },
  secondParty: { name: 'Tech Solutions Ltd', email: 'contracts@techsol.com', avatar: 'TS' },
  createdAt: '2025-01-15T10:00:00',
  submittedAt: '2025-01-15T14:30:00',
  timeline: [
    {
      id: 1,
      stepNumber: 1,
      actionType: 'created',
      actorName: 'John Doe',
      actorRole: 'first_party',
      description: 'Workflow created and initial parameters set',
      createdAt: '2025-01-15T10:00:00'
    },
    {
      id: 2,
      stepNumber: 2,
      actionType: 'submitted',
      actorName: 'John Doe',
      actorRole: 'first_party',
      description: 'Workflow submitted for review with message: "Please review the confidentiality terms"',
      createdAt: '2025-01-15T14:30:00'
    },
    {
      id: 3,
      stepNumber: 3,
      actionType: 'reviewed',
      actorName: 'Jane Smith',
      actorRole: 'second_party',
      description: 'Second party accepted invitation and started reviewing',
      createdAt: '2025-01-16T09:15:00'
    },
    {
      id: 4,
      stepNumber: 4,
      actionType: 'requested_changes',
      actorName: 'Jane Smith',
      actorRole: 'second_party',
      description: 'Requested changes to 3 parameters: Confidentiality Period, Jurisdiction, and Non-Solicitation',
      createdAt: '2025-01-16T11:45:00'
    },
    {
      id: 5,
      stepNumber: 5,
      actionType: 'commented',
      actorName: 'Jane Smith',
      actorRole: 'second_party',
      description: 'Added comment on Duration of Confidentiality section',
      createdAt: '2025-01-16T11:50:00'
    }
  ],
  parameters: [
    {
      id: 1,
      label: 'Confidentiality Period',
      section: 'Duration',
      originalValue: '5 years',
      proposedValue: '3 years',
      status: 'proposed',
      changeReason: '5 years is too long for our industry standard'
    },
    {
      id: 2,
      label: 'Agreement Term',
      section: 'Term',
      originalValue: '3 years',
      proposedValue: null,
      status: 'original'
    },
    {
      id: 3,
      label: 'Governing Law',
      section: 'Legal',
      originalValue: 'Maharashtra, India',
      proposedValue: null,
      status: 'original'
    }
  ],
  comments: [
    {
      id: 1,
      section: 'Duration of Confidentiality',
      text: 'Can we discuss reducing the confidentiality period? 5 years seems excessive for our type of collaboration.',
      authorName: 'Jane Smith',
      authorRole: 'second_party',
      createdAt: '2025-01-16T11:50:00',
      replies: [
        {
          id: 2,
          text: 'I understand your concern. However, given the sensitive nature of our technology, we need adequate protection. Would 4 years be acceptable?',
          authorName: 'John Doe',
          authorRole: 'first_party',
          createdAt: '2025-01-16T14:20:00'
        }
      ]
    }
  ]
};

const WorkflowDetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'parameters' | 'comments'>('timeline');
  const [newComment, setNewComment] = useState('');

  const getActionIcon = (actionType: string): ReactElement => {
    const icons: { [key: string]: ReactElement } = {
      created: <FileText className="w-5 h-5" />,
      submitted: <Send className="w-5 h-5" />,
      reviewed: <Eye className="w-5 h-5" />,
      requested_changes: <Edit className="w-5 h-5" />,
      responded_to_changes: <MessageSquare className="w-5 h-5" />,
      approved: <CheckCircle className="w-5 h-5" />,
      rejected: <XCircle className="w-5 h-5" />,
      commented: <MessageSquare className="w-5 h-5" />
    };
    return icons[actionType] || <Clock className="w-5 h-5" />;
  };

  const getActionColor = (actionType: string) => {
    const colors: { [key: string]: string } = {
      created: 'from-primary-500 to-primary-600',
      submitted: 'from-blue-500 to-blue-600',
      reviewed: 'from-purple-500 to-purple-600',
      requested_changes: 'from-warning-500 to-warning-600',
      responded_to_changes: 'from-secondary-500 to-secondary-600',
      approved: 'from-success-500 to-success-600',
      rejected: 'from-danger-500 to-danger-600',
      commented: 'from-indigo-500 to-indigo-600'
    };
    return colors[actionType] || 'from-dark-500 to-dark-600';
  };

  const getParameterStatusBadge = (status: string): ReactElement => {
    const badges: { [key: string]: ReactElement } = {
      original: <span className="badge bg-dark-100 text-dark-700">Original</span>,
      proposed: <span className="badge bg-warning-100 text-warning-700">Proposed Change</span>,
      accepted: <span className="badge bg-success-100 text-success-700">Accepted</span>,
      rejected: <span className="badge bg-danger-100 text-danger-700">Rejected</span>,
      counter_proposed: <span className="badge bg-secondary-100 text-secondary-700">Counter Proposed</span>
    };
    return badges[status] || badges.original;
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #ffffff, #f0f9ff)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card p-6 mb-6 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button className="btn-ghost p-2">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-display font-bold text-gradient">
                  {workflowData.documentType}
                </h1>
                <p className="text-dark-600 mt-1">Workflow #{workflowData.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-ghost p-3 rounded-xl">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="btn-ghost p-3 rounded-xl">
                <Download className="w-5 h-5" />
              </button>
              <button className="btn-ghost p-3 rounded-xl">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-xl border border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm text-dark-600 mb-1">Status</div>
                  <span className="status-negotiation text-lg">
                    <Users className="w-5 h-5 inline mr-2" />
                    In Negotiation
                  </span>
                </div>
                <div className="h-12 w-px bg-dark-200"></div>
                <div>
                  <div className="text-sm text-dark-600 mb-1">Current Stage</div>
                  <div className="text-lg font-semibold text-dark-900">Awaiting Your Response</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-outline flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button className="btn-primary flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Respond to Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass-card p-6 animate-slide-up">
            <div className="text-sm text-dark-600 mb-3">First Party</div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-glow">
                {workflowData.firstParty.avatar}
              </div>
              <div>
                <div className="font-bold text-xl text-dark-900">{workflowData.firstParty.name}</div>
                <div className="text-dark-600">{workflowData.firstParty.email}</div>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="text-sm text-dark-600 mb-3">Second Party</div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-glow-purple">
                {workflowData.secondParty.avatar}
              </div>
              <div>
                <div className="font-bold text-xl text-dark-900">{workflowData.secondParty.name}</div>
                <div className="text-dark-600">{workflowData.secondParty.email}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="glass-card mb-6 animate-fade-in">
          <div className="flex border-b border-dark-200">
            {['timeline', 'parameters', 'comments'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'timeline' | 'parameters' | 'comments')}
                className={`px-8 py-4 font-semibold transition-all duration-300 relative ${
                  activeTab === tab 
                    ? 'text-primary-600' 
                    : 'text-dark-600 hover:text-dark-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-t-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="glass-card p-8 animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-7 h-7 text-primary-600" />
              Activity Timeline
            </h2>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary-300 via-secondary-300 to-transparent"></div>
              {/* Timeline Items */}
              <div className="space-y-6">
                {workflowData.timeline.map((step, index) => (
                  <div 
                    key={step.id} 
                    className="relative pl-16 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Icon Circle */}
                    <div className={`absolute left-0 w-12 h-12 bg-gradient-to-br ${getActionColor(step.actionType)} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {getActionIcon(step.actionType)}
                    </div>
                    {/* Content Card */}
                    <div className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl p-6 hover:shadow-glass-hover transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg text-dark-900 mb-1">
                            {step.actionType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </div>
                          <div className="text-dark-600 text-sm">
                            by <span className="font-semibold">{step.actorName}</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              step.actorRole === 'first_party' 
                                ? 'bg-primary-100 text-primary-700' 
                                : 'bg-secondary-100 text-secondary-700'
                            }`}>
                              {step.actorRole === 'first_party' ? 'First Party' : 'Second Party'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-dark-500">
                          {new Date(step.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <p className="text-dark-700 mt-3">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <div className="glass-card p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-primary-600" />
                Negotiable Parameters
              </h2>
              <span className="badge badge-warning">3 Changes Pending</span>
            </div>
            <div className="space-y-4">
              {workflowData.parameters.map((param, index) => (
                <div 
                  key={param.id}
                  className="bg-white/60 backdrop-blur-sm border-2 border-white/60 rounded-xl p-6 hover:border-primary-200 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-dark-900">{param.label}</h3>
                        {getParameterStatusBadge(param.status)}
                      </div>
                      <div className="text-sm text-dark-600">Section: {param.section}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original Value */}
                    <div className="bg-dark-50 p-4 rounded-lg">
                      <div className="text-sm text-dark-600 mb-2">Original Value</div>
                      <div className="text-lg font-semibold text-dark-900">{param.originalValue}</div>
                    </div>
                    {/* Proposed Value */}
                    {param.proposedValue && (
                      <div className="bg-warning-50 p-4 rounded-lg border-2 border-warning-300">
                        <div className="text-sm text-warning-700 mb-2">Proposed Value</div>
                        <div className="text-lg font-semibold text-warning-900">{param.proposedValue}</div>
                      </div>
                    )}
                  </div>
                  {param.changeReason && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm text-blue-700 mb-1">Reason for Change:</div>
                      <div className="text-dark-900">{param.changeReason}</div>
                    </div>
                  )}
                  {param.status === 'proposed' && (
                    <div className="mt-4 flex gap-3">
                      <button className="btn-outline flex-1 flex items-center justify-center gap-2">
                        <ThumbsDown className="w-5 h-5" />
                        Reject
                      </button>
                      <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
                        <Edit className="w-5 h-5" />
                        Counter Propose
                      </button>
                      <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                        <ThumbsUp className="w-5 h-5" />
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="glass-card p-8 animate-scale-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-primary-600" />
              Discussion & Comments
            </h2>
            {/* New Comment Box */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl border border-primary-200 mb-6">
              <textarea
                placeholder="Add your comment or question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="input-modern min-h-[100px] resize-none mb-4"
              />
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Post Comment
              </button>
            </div>
            {/* Comments List */}
            <div className="space-y-6">
              {workflowData.comments.map((comment, index) => (
                <div key={comment.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Main Comment */}
                  <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        comment.authorRole === 'first_party' 
                          ? 'from-primary-400 to-primary-600' 
                          : 'from-secondary-400 to-secondary-600'
                      } rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                        {comment.authorName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-dark-900">{comment.authorName}</span>
                          <span className={`badge ${
                            comment.authorRole === 'first_party' ? 'badge-info' : 'bg-secondary-100 text-secondary-700'
                          }`}>
                            {comment.authorRole === 'first_party' ? 'First Party' : 'Second Party'}
                          </span>
                          <span className="text-sm text-dark-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="badge badge-warning mb-3">
                          Section: {comment.section}
                        </div>
                        <p className="text-dark-700">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-16 mt-4 space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-white/40 backdrop-blur-sm border border-white/40 rounded-xl p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 bg-gradient-to-br ${
                              reply.authorRole === 'first_party' 
                                ? 'from-primary-400 to-primary-600' 
                                : 'from-secondary-400 to-secondary-600'
                            } rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                              {reply.authorName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-dark-900">{reply.authorName}</span>
                                <span className="text-sm text-dark-500">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-dark-700">{reply.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowDetailPage;
