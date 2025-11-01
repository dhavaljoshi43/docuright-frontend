import React, { useState, useEffect, type ReactElement } from 'react';
import {
  Sparkles, Brain, TrendingUp, AlertCircle, CheckCircle,
  XCircle, ThumbsUp, ThumbsDown, Info, Zap, Scale,
  BarChart3, RefreshCw, Eye, MessageSquare
} from 'lucide-react';

type SuggestionType = 'compromise' | 'legal_rationale' | 'alternative' | 'clarification';

interface Alternative {
  value: string;
  pros: string;
  cons: string;
}

interface RiskAssessment {
  firstPartyRisk: string;
  secondPartyRisk: string;
}

interface AISuggestion {
  id: number;
  parameterId: number;
  parameterLabel: string;
  suggestionType: SuggestionType;
  suggestionText: string;
  suggestedValue: string;
  reasoning: string;
  confidenceScore: number;
  isAccepted: boolean;
  createdAt: string;
  alternatives?: Alternative[];
  riskAssessment?: RiskAssessment;
}

interface AISuggestionsPanelProps {
  workflowId: number;
  parameterId?: number;
}

const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({ workflowId, parameterId }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);

  // Mock data for demonstration
  const mockSuggestions: AISuggestion[] = [
    {
      id: 1,
      parameterId: 1,
      parameterLabel: 'Confidentiality Period',
      suggestionType: 'compromise',
      suggestionText: 'Consider a middle-ground approach of 4 years',
      suggestedValue: '4 years',
      reasoning: 'A 4-year confidentiality period balances the first party\'s need for long-term protection with the second party\'s industry standard concerns. This duration is common in technology partnerships and provides adequate protection while remaining reasonable.',
      confidenceScore: 0.87,
      isAccepted: false,
      createdAt: '2025-01-16T12:00:00',
      alternatives: [
        {
          value: '3.5 years',
          pros: 'Closer to industry standard',
          cons: 'May not provide sufficient long-term protection'
        },
        {
          value: '4.5 years',
          pros: 'Extended protection period',
          cons: 'Might be difficult for second party to accept'
        }
      ],
      riskAssessment: {
        firstPartyRisk: 'Without adequate protection period, sensitive technology details could be exposed too early, reducing competitive advantage.',
        secondPartyRisk: 'Excessive confidentiality periods may limit future business opportunities and industry standard practices.'
      }
    },
    {
      id: 2,
      parameterId: 3,
      parameterLabel: 'Jurisdiction',
      suggestionType: 'legal_rationale',
      suggestionText: 'Mumbai jurisdiction with arbitration clause recommended',
      suggestedValue: 'Mumbai, Maharashtra with International Arbitration',
      reasoning: 'Mumbai provides strong legal infrastructure and is acceptable to both parties. Adding an international arbitration clause provides flexibility and reduces litigation costs while maintaining enforceability.',
      confidenceScore: 0.92,
      isAccepted: false,
      createdAt: '2025-01-16T12:05:00'
    }
  ];

  useEffect(() => {
    setSuggestions(mockSuggestions);
  }, [workflowId, parameterId]);

  const analyzeConflicts = async () => {
    setAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyzing(false);
      setSuggestions(mockSuggestions);
    }, 2000);
  };

  const acceptSuggestion = (suggestionId: number) => {
    setSuggestions(suggestions.map(s =>
      s.id === suggestionId ? { ...s, isAccepted: true } : s
    ));
  };

  const getSuggestionTypeIcon = (type: SuggestionType): ReactElement => {
    const icons: { [key in SuggestionType]: ReactElement } = {
      compromise: <TrendingUp className="w-5 h-5" />,
      legal_rationale: <Scale className="w-5 h-5" />,
      alternative: <BarChart3 className="w-5 h-5" />,
      clarification: <Info className="w-5 h-5" />
    };
    return icons[type] || <Brain className="w-5 h-5" />;
  };

  const getSuggestionTypeColor = (type: SuggestionType) => {
    const colors: { [key in SuggestionType]: string } = {
      compromise: 'from-primary-500 to-blue-500',
      legal_rationale: 'from-purple-500 to-indigo-500',
      alternative: 'from-secondary-500 to-pink-500',
      clarification: 'from-warning-500 to-orange-500'
    };
    return colors[type] || 'from-dark-500 to-dark-600';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-success-600';
    if (score >= 0.6) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 animate-slide-down">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-glow-purple">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient">AI Conflict Resolution</h2>
              <p className="text-dark-600">Intelligent suggestions powered by Gemini AI</p>
            </div>
          </div>
          <button 
            onClick={analyzeConflicts}
            disabled={analyzing}
            className="btn-primary flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                Analyze Conflicts
              </>
            )}
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <Zap className="w-6 h-6 text-purple-600" />
            <div>
              <div className="font-semibold text-purple-900">
                {suggestions.length} AI Suggestion{suggestions.length > 1 ? 's' : ''} Available
              </div>
              <div className="text-sm text-purple-700">
                Review AI-powered compromise solutions below
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Suggestions List */}
      {suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className="glass-card p-6 hover:shadow-glass-hover transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getSuggestionTypeColor(suggestion.suggestionType)} rounded-xl flex items-center justify-center shadow-lg`}>
                    {getSuggestionTypeIcon(suggestion.suggestionType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-dark-900">
                        {suggestion.parameterLabel}
                      </h3>
                      <span className="badge bg-purple-100 text-purple-700">
                        {suggestion.suggestionType.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-dark-600">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Gemini 2.0 Flash
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Confidence: <span className={`font-semibold ${getConfidenceColor(suggestion.confidenceScore)}`}>
                          {(suggestion.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {suggestion.isAccepted && (
                  <span className="badge badge-success flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Accepted
                  </span>
                )}
              </div>
              {/* Main Suggestion */}
              <div className="mb-6 p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-200">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-bold text-lg text-dark-900 mb-2">
                      {suggestion.suggestionText}
                    </div>
                    <div className="text-dark-700 mb-4">
                      {suggestion.reasoning}
                    </div>
                    <div className="p-4 bg-white rounded-lg border-2 border-primary-300">
                      <div className="text-sm text-dark-600 mb-1">Suggested Value:</div>
                      <div className="text-xl font-bold text-primary-700">
                        {suggestion.suggestedValue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Risk Assessment */}
              {suggestion.riskAssessment && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-warning-50 to-orange-50 rounded-xl border border-warning-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-warning-600" />
                      <span className="font-semibold text-warning-900">First Party Risk</span>
                    </div>
                    <p className="text-sm text-warning-800">
                      {suggestion.riskAssessment.firstPartyRisk}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-warning-50 to-orange-50 rounded-xl border border-warning-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-warning-600" />
                      <span className="font-semibold text-warning-900">Second Party Risk</span>
                    </div>
                    <p className="text-sm text-warning-800">
                      {suggestion.riskAssessment.secondPartyRisk}
                    </p>
                  </div>
                </div>
              )}
              {/* Alternatives */}
              {suggestion.alternatives && (
                <div className="mb-6">
                  <div className="font-semibold text-dark-900 mb-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-secondary-600" />
                    Alternative Options
                  </div>
                  <div className="space-y-3">
                    {suggestion.alternatives.map((alt, idx) => (
                      <div 
                        key={idx}
                        className="p-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl hover:border-secondary-300 transition-all"
                      >
                        <div className="font-semibold text-dark-900 mb-2">
                          Option {idx + 1}: {alt.value}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-1 text-success-700 mb-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="font-semibold">Pros:</span>
                            </div>
                            <p className="text-dark-700">{alt.pros}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 text-danger-700 mb-1">
                              <ThumbsDown className="w-4 h-4" />
                              <span className="font-semibold">Cons:</span>
                            </div>
                            <p className="text-dark-700">{alt.cons}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Actions */}
              {!suggestion.isAccepted && (
                <div className="flex gap-3 pt-4 border-t border-dark-200">
                  <button
                    onClick={() => setSelectedSuggestion(suggestion)}
                    className="btn-ghost flex-1 flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View Details
                  </button>
                  <button
                    onClick={() => setSelectedSuggestion(suggestion)}
                    className="btn-outline flex-1 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Discuss
                  </button>
                  <button
                    onClick={() => acceptSuggestion(suggestion.id)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept & Apply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-dark-700 mb-2">No AI Suggestions Yet</h3>
          <p className="text-dark-600 mb-6">
            Click "Analyze Conflicts" to generate intelligent compromise solutions
          </p>
          <button 
            onClick={analyzeConflicts}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Generate AI Suggestions
          </button>
        </div>
      )}
      {/* AI Info Panel */}
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-dark-900 mb-2">How AI Suggestions Work</h4>
            <ul className="space-y-2 text-sm text-dark-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>AI analyzes both parties' positions and legal context</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>Suggests fair compromises based on industry standards</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>Provides legal reasoning and risk assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                <span>You maintain full control - AI only suggests, you decide</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsPanel;
