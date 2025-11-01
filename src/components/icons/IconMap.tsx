import {
    FileText, Zap, Users, TrendingUp, Clock, CheckCircle,
    Plus, Bell, Settings, LogOut, Menu, X, Search,
    Shield, Briefcase, FileCheck, Mail
  } from 'lucide-react';
  
  export const iconMap = {
    FileText,
    Zap,
    Users,
    TrendingUp,
    Clock,
    CheckCircle,
    Plus,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Shield,
    Briefcase,
    FileCheck,
    Mail
  };
  
  // Quick Action Icons with colors
  export const QuickActionIcon = ({ type }: { type: string }) => {
    const iconConfig = {
      nda: {
        icon: Shield,
        gradient: 'from-primary-500 to-primary-600'
      },
      employment: {
        icon: Briefcase,
        gradient: 'from-purple-500 to-purple-600'
      },
      service: {
        icon: FileCheck,
        gradient: 'from-secondary-500 to-secondary-600'
      },
      workflow: {
        icon: Zap,
        gradient: 'from-warning-500 to-warning-600'
      }
    };
  
    const config = iconConfig[type as keyof typeof iconConfig] || iconConfig.nda;
    const Icon = config.icon;
  
    return (
      <div className={`w-14 h-14 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    );
  };