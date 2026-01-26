import React, { useState } from 'react';
import { Activity, ChevronLeft, Save, Send, AlertCircle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';

interface CaseAnalysisScreenProps {
  caseId: string;
  onBack: () => void;
}

// Mock case data
const caseData = {
  id: 'C001',
  patientName: 'Sarah Johnson',
  age: 45,
  gender: 'Female',
  mrn: 'MRN-2024-001',
  uploadDate: 'January 24, 2024',
  overallRisk: 72,
  riskLevel: 'high',
  models: [
    { name: 'Image Analysis', score: 75, color: 'blue' as const },
    { name: 'Genetic Profile', score: 68, color: 'purple' as const },
    { name: 'Protein Expression', score: 78, color: 'green' as const },
    { name: 'Clinical History', score: 67, color: 'orange' as const },
  ],
  geneticMarkers: [
    { name: 'BRCA1', status: 'positive' },
    { name: 'BRCA2', status: 'negative' },
    { name: 'TP53', status: 'positive' },
    { name: 'PIK3CA', status: 'negative' },
  ],
  proteinExpression: [
    { name: 'ER (Estrogen Receptor)', level: 85, color: 'green' as const },
    { name: 'PR (Progesterone Receptor)', level: 72, color: 'green' as const },
    { name: 'HER2', level: 45, color: 'yellow' as const },
    { name: 'Ki67', level: 30, color: 'orange' as const },
  ],
  aiRecommendations: [
    'Consider additional imaging studies (MRI recommended)',
    'Genetic counseling for BRCA1 and TP53 mutations',
    'Multidisciplinary tumor board review advised',
    'Discuss treatment options including targeted therapy',
  ],
};

export function CaseAnalysisScreen({ caseId, onBack }: CaseAnalysisScreenProps) {
  const [doctorNotes, setDoctorNotes] = useState('');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const handleSaveDraft = () => {
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  const handleFinalize = () => {
    // Handle finalize logic
    alert('Report finalized and sent to patient');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Activity className="w-8 h-8 text-[#2563EB]" />
            <span className="text-xl font-bold text-gray-900">Tawhida</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Doctor Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Patient Info Banner */}
        <Card gradient="blue">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">{caseData.patientName}</h1>
                <div className="flex items-center gap-4 text-blue-100">
                  <span>Age: {caseData.age}</span>
                  <span>•</span>
                  <span>Gender: {caseData.gender}</span>
                  <span>•</span>
                  <span>MRN: {caseData.mrn}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Case ID: {caseData.id}</p>
              <p className="text-sm text-blue-100">Uploaded: {caseData.uploadDate}</p>
            </div>
          </div>
        </Card>

        {/* Overall Risk Assessment */}
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Overall Risk Assessment</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-6xl font-bold text-red-600">{caseData.overallRisk}%</span>
                  <span className="text-2xl font-semibold text-red-600 bg-red-100 px-4 py-2 rounded-lg">
                    HIGH RISK
                  </span>
                </div>
              </div>
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-5xl">
                🔴
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Model Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Model Analysis Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseData.models.map((model) => (
                <div key={model.name} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {model.name === 'Image Analysis' && '🔬'}
                      {model.name === 'Genetic Profile' && '🧬'}
                      {model.name === 'Protein Expression' && '🧪'}
                      {model.name === 'Clinical History' && '📋'}
                      {' '}{model.name}
                    </span>
                    <span className="text-2xl font-bold text-gray-900">{model.score}%</span>
                  </div>
                  <Progress value={model.score} color={model.color} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Genetic Markers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🧬</span>
                Genetic Markers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {caseData.geneticMarkers.map((marker) => (
                  <div key={marker.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{marker.name}</span>
                    <Badge variant={marker.status as any}>
                      {marker.status === 'positive' ? '⚠️ POSITIVE' : '✓ NEGATIVE'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Protein Expression */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🧪</span>
                Protein Expression Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseData.proteinExpression.map((protein) => (
                  <div key={protein.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{protein.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{protein.level}%</span>
                    </div>
                    <Progress value={protein.level} color={protein.color} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Treatment Recommendations */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              AI Treatment Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {caseData.aiRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-gray-700">{rec}</span>
                    {index === 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-700">High priority recommendation</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Doctor's Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Doctor's Notes & Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Enter your clinical assessment, additional observations, and treatment plan recommendations..."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
            />
            <div className="mt-4 text-sm text-gray-600">
              <p>💡 Include: Clinical correlation, recommended next steps, and any additional testing needed</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 sticky bottom-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <Button
            variant="secondary"
            onClick={onBack}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="blue"
            onClick={handleSaveDraft}
            className="flex-1"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
          >
            <Send className="w-4 h-4" />
            Request Second Opinion
          </Button>
          <Button
            variant="primary"
            onClick={handleFinalize}
            className="flex-1"
            disabled={!doctorNotes}
          >
            <FileText className="w-4 h-4" />
            Finalize Report
          </Button>
        </div>

        {/* Save Confirmation */}
        {showSaveConfirm && (
          <div className="fixed bottom-24 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Draft saved successfully</span>
          </div>
        )}
      </main>
    </div>
  );
}
