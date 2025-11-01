import React, { useState } from 'react';
import {
  FileText, Zap, Users, TrendingUp, Clock, CheckCircle,
  ArrowRight, Plus, Sparkles, Shield, BarChart3, Bell,
  Search, Settings, LogOut, Menu, X, FileCheck, Mail
} from 'lucide-react';

const ModernHomepage = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const stats = [
    { 
      label: 'Total Documents', 
      value: '24', 
      change: '+12%', 
      icon: FileText,
      bgColor: '#0ea5e9'
    },
    { 
      label: 'Active Workflows', 
      value: '8', 
      change: '+3', 
      icon: TrendingUp,
      bgColor: '#f59e0b'
    },
    { 
      label: 'Completed', 
      value: '16', 
      change: '100%', 
      icon: CheckCircle,
      bgColor: '#22c55e'
    },
    { 
      label: 'Pending', 
      value: '5', 
      change: '-2', 
      icon: Clock,
      bgColor: '#d946ef'
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

  const quickActions = [
    {
      title: 'Create NDA',
      description: 'Generate a new Non-Disclosure Agreement',
      icon: Shield,
      bgColor: '#0ea5e9',
      action: 'nda'
    },
    {
      title: 'Employment Agreement',
      description: 'Create employment contract',
      icon: Users,
      bgColor: '#a855f7',
      action: 'employment'
    },
    {
      title: 'Service Agreement',
      description: 'Define service delivery terms',
      icon: FileCheck,
      bgColor: '#d946ef',
      action: 'service'
    },
    {
      title: 'Offer Letter',
      description: 'Professional employment offers',
      icon: Mail,
      bgColor: '#f59e0b',
      action: 'offer'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)' }}
              >
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DocuRight AI
                </h1>
                <p className="text-xs text-gray-600">Smart Document Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors relative">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
                <Settings className="w-6 h-6 text-gray-700" />
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
                >
                  JD
                </div>
                <div className="hidden lg:block">
                  <div className="font-semibold text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-600">john@acme.com</div>
                </div>
              </div>
              <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
                <LogOut className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-3 rounded-xl hover:bg-gray-100"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">John</span> 👋
              </h2>
              <p className="text-gray-600 text-lg">
                You have 8 active workflows and 5 pending actions
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Document
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <stat.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-7 h-7 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={action.action}
                className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 text-left hover:scale-105 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: action.bgColor }}
                >
                  <action.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">{action.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Clock className="w-7 h-7 text-blue-600" />
                  Recent Activity
                </h3>
                <button className="text-blue-600 font-semibold hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {activity.status === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                      {activity.status === 'warning' && <Clock className="w-6 h-6 text-yellow-600" />}
                      {activity.status === 'info' && <FileText className="w-6 h-6 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-600">{activity.party}</div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 px-6 py-3 border-2 border-blue-600 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300">
                View All Activity
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* AI Insights */}
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                AI Insights
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' }}
                    >
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
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                This Month
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Documents Created</span>
                  <span className="font-bold text-2xl text-blue-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Workflows Completed</span>
                  <span className="font-bold text-2xl text-green-600">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Time Saved</span>
                  <span className="font-bold text-2xl text-purple-600">24h</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Efficiency Score</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: '87%',
                        background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
                      }}
                    ></div>
                  </div>
                  <span className="font-bold text-green-600">87%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHomepage;