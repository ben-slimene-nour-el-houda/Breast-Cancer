import React from 'react';
import { Activity, ChevronLeft, Download, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';

interface TestResultsScreenProps {
  testId: string;
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export function TestResultsScreen({ testId, onBack, onNavigate }: TestResultsScreenProps) {
  // Mock test data
  const testData = {
    id: testId,
    date: 'January 20, 2024',
    overallRisk: 28,
    riskLevel: 'low',
    doctor: 'Dr. Michael Chen',
    aiSummary: 'The AI analysis indicates a low risk of malignancy. The tissue samples show normal cellular structure with no significant abnormalities detected. Genetic markers and protein expression levels are within normal ranges.',
    recommendations: [
      'Continue regular screening schedule',
      'Maintain healthy lifestyle choices',
      'Follow up in 6 months for routine check',
    ],
    doctorNotes: 'I have reviewed the AI analysis and pathology images. The results are consistent with benign findings. No immediate intervention required. Patient should continue with standard surveillance protocol.',
    models: [
      { name: 'Image Analysis', score: 92, color: 'blue' as const },
      { name: 'Genetic Profile', score: 85, color: 'purple' as const },
      { name: 'Protein Expression', score: 88, color: 'green' as const },
      { name: 'Clinical History', score: 90, color: 'orange' as const },
    ],
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Activity className="w-8 h-8 text-[#9333EA]" />
            <span className="text-xl font-bold text-gray-900">Tawhida</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
              <Badge variant={testData.riskLevel as any}>
                {testData.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
            <p className="text-gray-600">Test ID: {testData.id} • Date: {testData.date}</p>
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Overall Risk Assessment */}
        <Card className={`border-2 ${testData.riskLevel === 'low' ? 'border-green-200' : testData.riskLevel === 'medium' ? 'border-yellow-200' : 'border-red-200'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Risk Assessment</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-6xl font-bold ${
                    testData.riskLevel === 'low' ? 'text-green-600' :
                    testData.riskLevel === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {testData.overallRisk}%
                  </span>
                  <span className={`text-2xl font-semibold ${getRiskColor(testData.riskLevel)} px-4 py-2 rounded-lg`}>
                    {testData.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl ${
                testData.riskLevel === 'low' ? 'bg-green-100' :
                testData.riskLevel === 'medium' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                {testData.riskLevel === 'low' ? '🟢' : testData.riskLevel === 'medium' ? '🟡' : '🔴'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Model Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Model Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testData.models.map((model) => (
                <div key={model.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {model.name === 'Image Analysis' && '🔬'}
                      {model.name === 'Genetic Profile' && '🧬'}
                      {model.name === 'Protein Expression' && '🧪'}
                      {model.name === 'Clinical History' && '📋'}
                      {' '}{model.name}
                    </span>
                    <span className="font-semibold text-gray-900">{model.score}%</span>
                  </div>
                  <Progress value={model.score} color={model.color} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Summary */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{testData.aiSummary}</p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-green-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {testData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Doctor's Notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Doctor's Review</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#4F46E5] rounded-full flex items-center justify-center text-white font-medium text-xs">
                  MC
                </div>
                <span>{testData.doctor}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed italic">
                "{testData.doctorNotes}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={onBack}>
            Back to Dashboard
          </Button>
          <Button variant="primary" className="flex-1">
            <Calendar className="w-4 h-4" />
            Schedule Follow-up
          </Button>
        </div>
      </main>
    </div>
  );
}