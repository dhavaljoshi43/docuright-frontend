'use client';

import { useState } from 'react';
import { NdaForm } from '@/components/NdaForm';
import ModernNdaForm from '@/components/documents/ModernNdaForm';
import { OfferLetterForm } from '@/components/OfferLetterForm';
import { AuthModal } from '@/components/AuthForms';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, Zap, Users, TrendingUp, Clock, CheckCircle,
  ArrowRight, Plus, Sparkles, Shield, BarChart3, Bell,
  Settings, LogOut
} from 'lucide-react';

type DocType = 'none' | 'nda' | 'offer';

export default function Dashboard() {
  const [docType, setDocType] = useState<DocType>('none');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const stats = [
    { label: 'Total Documents', value: '24', change: '+12%', icon: FileText, color: 'primary' },
    { label: 'Active Workflows', value: '8', change: '+3', icon: TrendingUp, color: 'warning' },
    { label: 'Completed', value: '16', change: '100%', icon: CheckCircle, color: 'success' },
    { label: 'Pending', value: '5', change: '-2', icon: Clock, color: 'secondary' }
  ];

  const quickActions = [
    {
      title: 'Create NDA',
      description: 'Generate a new Non-Disclosure Agreement',
      icon: Shield,
      color: 'from-primary-500 to-primary-600',
      action: 'nda'
    },
    {
      title: 'Employment Agreement',
      description: 'Create employment contract',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      action: 'employment'
    },
    {
      title: 'Service Agreement',
      description: 'Define service delivery terms',
      icon: FileText,
      color: 'from-secondary-500 to-secondary-600',
      action: 'service'
    },
    {
      title: 'Offer Letter',
      description: 'Professional employment offers',
      icon: Zap,
      color: 'from-warning-500 to-warning-600',
      action: 'offer'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'NDA approved',
      party: 'Tech Solutions Ltd',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      action: 'Changes requested',
      party: 'Startup Inc',
      time: '5 hours ago',
      status: 'warning'
    },
    {
      id: 3,
      action: 'Workflow created',
      party: 'Digital Agency',
      time: '1 day ago',
      status: 'info'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />

      {/* Top Navigation */}
      <nav className="glass-card sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-glow">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gradient">
                  DocuRight AI
                </h1>
                <p className="text-xs text-dark-600">Smart Document Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button className="btn-ghost p-3 rounded-xl relative">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full"></span>
                  </button>
                  <button className="btn-ghost p-3 rounded-xl">
                    <Settings className="w-6 h-6" />
                  </button>
                  <div className="h-8 w-px bg-dark-200"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.fullName?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <div className="hidden lg:block">
                      <div className="font-semibold text-dark-900">{user?.fullName || 'User'}</div>
                      <div className="text-xs text-dark-600">{user?.email}</div>
                    </div>
                  </div>
                  <button onClick={logout} className="btn-ghost p-3 rounded-xl">
                    <LogOut className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="btn-primary">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {docType === 'none' && (
          <>
            {/* Hero Section */}
            <div className="glass-card p-8 mb-8 animate-slide-down">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-display font-bold mb-2">
                    Welcome back, <span className="text-gradient">{isAuthenticated ? user?.fullName?.split(' ')[0] || 'User' : 'Guest'}</span> 👋
                  </h2>
                  <p className="text-dark-600 text-lg">
                    {isAuthenticated ? 'You have 8 active workflows and 5 pending actions' : 'Generate professional legal documents in minutes with AI'}
                  </p>
                </div>
                <button onClick={() => setDocType('nda')} className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-glow">
                  <Plus className="w-5 h-5" />
                  Create Document
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            {isAuthenticated && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="glass-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-semibold ${
                        stat.change.startsWith('+') ? 'text-success-600' : 'text-dark-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-dark-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-dark-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-7 h-7 text-primary-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={action.action}
                    onClick={() => {
                      if (action.action === 'nda') {
                        setDocType('nda');
                      } else if (action.action === 'offer') {
                        setDocType('offer');
                      }
                    }}
                    className="glass-card p-6 text-left hover:scale-105 transition-all duration-300 group animate-scale-in cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-glow transition-shadow`}>
                      <action.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-dark-900">{action.title}</h4>
                    <p className="text-sm text-dark-600 mb-4">{action.description}</p>
                    <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            {isAuthenticated && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <div className="glass-card p-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Clock className="w-7 h-7 text-primary-600" />
                        Recent Activity
                      </h3>
                      <button className="text-primary-600 font-semibold hover:underline">
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div 
                          key={activity.id}
                          className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 hover:border-primary-200 transition-all duration-300 animate-slide-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            activity.status === 'success' ? 'bg-success-100' :
                            activity.status === 'warning' ? 'bg-warning-100' :
                            'bg-primary-100'
                          }`}>
                            {activity.status === 'success' && <CheckCircle className="w-6 h-6 text-success-600" />}
                            {activity.status === 'warning' && <Clock className="w-6 h-6 text-warning-600" />}
                            {activity.status === 'info' && <FileText className="w-6 h-6 text-primary-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-dark-900">{activity.action}</div>
                            <div className="text-sm text-dark-600">{activity.party}</div>
                          </div>
                          <div className="text-sm text-dark-500">{activity.time}</div>
                        </div>
                      ))}
                    </div>

                    <button className="btn-outline w-full mt-6">
                      View All Activity
                    </button>
                  </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                  {/* AI Insights */}
                  <div className="glass-card p-6 animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary-600" />
                      AI Insights
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-purple-900 mb-1">Quick Tip</div>
                            <p className="text-sm text-purple-800">
                              3 workflows are waiting for your response. Address them to speed up approvals.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-blue-900 mb-1">Performance</div>
                            <p className="text-sm text-blue-800">
                              Your average approval time is 2.5 days - 40% faster than industry average.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="glass-card p-6 animate-fade-in">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary-600" />
                      This Month
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-dark-700">Documents Created</span>
                        <span className="font-bold text-2xl text-primary-600">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-dark-700">Workflows Completed</span>
                        <span className="font-bold text-2xl text-success-600">8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-dark-700">Time Saved</span>
                        <span className="font-bold text-2xl text-secondary-600">24h</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-dark-200">
                      <div className="text-sm text-dark-600 mb-2">Efficiency Score</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-dark-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-success-500 to-success-600 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="font-bold text-success-600">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {docType === 'nda' && (
          <div className="animate-fade-in w-full">
            <ModernNdaForm onBack={() => setDocType('none')} />
          </div>
        )}
        
        {docType === 'offer' && (
          <div className="animate-fade-in">
            <button onClick={() => setDocType('none')} className="text-primary-600 hover:underline mb-4 font-medium flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </button>
            <OfferLetterForm />
          </div>
        )}
      </div>
    </div>
  );
}