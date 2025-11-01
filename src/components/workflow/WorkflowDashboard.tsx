import React, { useState, type ReactElement } from 'react';
import { 
  FileText, Clock, CheckCircle, XCircle, AlertCircle, 
  Users, MessageSquare, ArrowRight, Plus, Search,
  Filter, Calendar, TrendingUp, Eye
} from 'lucide-react';

type WorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'negotiation'
  | 'approved'
  | 'rejected';

interface Party {
  name: string;
  avatar: string;
}

interface WorkflowStats {
  totalSteps: number;
  unresolvedComments: number;
  pendingParameterChanges: number;
}

interface Workflow {
  id: number;
  documentType: string;
  status: WorkflowStatus;
  currentStage: string;
  firstParty: Party;
  secondParty: Party;
  createdAt: string;
  completedAt?: string;
  stats: WorkflowStats;
}

const mockWorkflows: Workflow[] = [
  {
    id: 1,
    documentType: 'NDA',
    status: 'negotiation',
    currentStage: 'first_party_response',
    firstParty: { name: 'Acme Corp', avatar: 'AC' },
    secondParty: { name: 'Tech Solutions', avatar: 'TS' },
    createdAt: '2025-01-15T10:00:00',
    stats: {
      totalSteps: 5,
      unresolvedComments: 2,
      pendingParameterChanges: 3
    }
  },
  {
    id: 2,
    documentType: 'Employment Agreement',
    status: 'under_review',
    currentStage: 'second_party_review',
    firstParty: { name: 'Startup Inc', avatar: 'SI' },
    secondParty: { name: 'John Smith', avatar: 'JS' },
    createdAt: '2025-01-14T14:30:00',
    stats: {
      totalSteps: 3,
      unresolvedComments: 0,
      pendingParameterChanges: 0
    }
  },
  {
    id: 3,
    documentType: 'Service Agreement',
    status: 'approved',
    currentStage: 'completed',
    firstParty: { name: 'Digital Agency', avatar: 'DA' },
    secondParty: { name: 'Client Co', avatar: 'CC' },
    createdAt: '2025-01-10T09:00:00',
    completedAt: '2025-01-13T16:00:00',
    stats: {
      totalSteps: 8,
      unresolvedComments: 0,
      pendingParameterChanges: 0
    }
  },
];

const WorkflowDashboard: React.FC = () => {
  const [workflows] = useState<Workflow[]>(mockWorkflows);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading] = useState<boolean>(false);

  const getStatusIcon = (status: WorkflowStatus): ReactElement => {
    const icons: { [key in WorkflowStatus]: ReactElement } = {
      draft: <Clock className="w-5 h-5" />,
      submitted: <ArrowRight className="w-5 h-5" />,
      under_review: <Eye className="w-5 h-5" />,
      negotiation: <Users className="w-5 h-5" />,
      approved: <CheckCircle className="w-5 h-5" />,
      rejected: <XCircle className="w-5 h-5" />,
    };
    return icons[status] || <FileText className="w-5 h-5" />;
  };

  const getStatusBadge = (status: WorkflowStatus) => {
    const classes: { [key in WorkflowStatus]: string } = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      under_review: 'status-under-review',
      negotiation: 'status-negotiation',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    return classes[status] || 'status-draft';
  };

  const filteredWorkflows = workflows.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (searchQuery && !w.documentType.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: workflows.length,
    active: workflows.filter((w) => ['submitted', 'under_review', 'negotiation'].includes(w.status)).length,
    approved: workflows.filter((w) => w.status === 'approved').length,
    pending: workflows.filter((w) => ['draft', 'submitted'].includes(w.status)).length
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #f8fafc, #ffffff, #f0f9ff)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="glass-card p-8 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-gradient mb-2">
                Workflow Dashboard
              </h1>
              <p className="text-dark-600 text-lg">
                Manage and track your document workflows
              </p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Workflow
            </button>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-600 font-medium">Total Workflows</span>
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-primary-700">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-warning-50 to-warning-100 p-6 rounded-xl border border-warning-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-600 font-medium">Active</span>
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
              <div className="text-3xl font-bold text-warning-700">{stats.active}</div>
            </div>
            <div className="bg-gradient-to-br from-success-50 to-success-100 p-6 rounded-xl border border-success-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-600 font-medium">Approved</span>
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="text-3xl font-bold text-success-700">{stats.approved}</div>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-6 rounded-xl border border-secondary-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-dark-600 font-medium">Pending</span>
                <Clock className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="text-3xl font-bold text-secondary-700">{stats.pending}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-12"
              />
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'draft', 'under_review', 'negotiation', 'approved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filter === f
                      ? 'bg-primary-600 text-white shadow-glow'
                      : 'bg-white text-dark-700 hover:bg-dark-50'
                  }`}
                >
                  {f.replace('_', ' ').charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Workflows List */}
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {filteredWorkflows.map((workflow, index) => (
            <div
              key={workflow.id}
              className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Document Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  {/* Workflow Info */}
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-1">
                      {workflow.documentType}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-dark-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(workflow.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <span className={getStatusBadge(workflow.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(workflow.status)}
                      {workflow.status.replace('_', ' ')}
                    </span>
                  </span>
                </div>
              </div>
              {/* Parties */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {workflow.firstParty.avatar}
                  </div>
                  <span className="text-dark-700 font-medium">{workflow.firstParty.name}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {workflow.secondParty.avatar}
                  </div>
                  <span className="text-dark-700 font-medium">{workflow.secondParty.name}</span>
                </div>
              </div>
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-dark-600">
                  <Clock className="w-4 h-4" />
                  <span>{workflow.stats.totalSteps} steps</span>
                </div>
                {workflow.stats.unresolvedComments > 0 && (
                  <div className="flex items-center gap-2 text-warning-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>{workflow.stats.unresolvedComments} comments</span>
                  </div>
                )}
                {workflow.stats.pendingParameterChanges > 0 && (
                  <div className="flex items-center gap-2 text-secondary-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{workflow.stats.pendingParameterChanges} pending changes</span>
                  </div>
                )}
              </div>
              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-dark-100">
                <button className="btn-outline w-full">
                  View Workflow Details
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredWorkflows.length === 0 && (
          <div className="glass-card p-12 text-center animate-fade-in">
            <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark-700 mb-2">No workflows found</h3>
            <p className="text-dark-600">Try adjusting your filters or create a new workflow</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowDashboard;
