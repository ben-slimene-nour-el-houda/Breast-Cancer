import React, { useState } from 'react';
import { Bell, Settings, LogOut, Upload, Eye, Activity, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientDashboardProps {
  onViewResults: (testId: string) => void;
  onUploadNew: () => void;
  onNavigate: (view: string) => void;
}

// Mock data
const testHistory = [
  {
    id: 'T001',
    date: '2024-01-20',
    status: 'reviewed',
    riskLevel: 'low',
    doctor: 'Dr. Chen',
  },
  {
    id: 'T002',
    date: '2024-01-15',
    status: 'reviewed',
    riskLevel: 'medium',
    doctor: 'Dr. Smith',
  },
  {
    id: 'T003',
    date: '2024-01-10',
    status: 'pending',
    riskLevel: 'pending',
    doctor: '-',
  },
];

const riskTrendData = [
  { date: 'Dec', risk: 15 },
  { date: 'Jan 10', risk: 25 },
  { date: 'Jan 15', risk: 35 },
  { date: 'Jan 20', risk: 18 },
];

const notifications = [
  {
    id: 1,
    type: 'success',
    message: 'Your test results are ready for review',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'info',
    message: 'Upcoming appointment with Dr. Chen on Jan 25',
    time: '1 day ago',
  },
  {
    id: 3,
    type: 'reminder',
    message: 'Please schedule your follow-up consultation',
    time: '2 days ago',
  },
];

export function PatientDashboard({ onViewResults, onUploadNew, onNavigate }: PatientDashboardProps) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-[#9333EA]" />
              <span className="text-xl font-bold text-gray-900">Tawhida</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate('dashboard')} className="text-gray-900 font-medium border-b-2 border-[#9333EA] pb-1">Dashboard</button>
              <button onClick={() => onNavigate('my-tests')} className="text-gray-600 hover:text-gray-900">My Tests</button>
              <button onClick={() => onNavigate('upload')} className="text-gray-600 hover:text-gray-900">Upload</button>
              <button onClick={() => onNavigate('profile')} className="text-gray-600 hover:text-gray-900">Profile</button>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#9333EA] to-[#EC4899] rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed right-6 top-20 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    notif.type === 'success' ? 'bg-green-500' :
                    notif.type === 'info' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome Card */}
        <Card gradient="purple">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name}</h1>
              <p className="text-purple-100">Patient ID: {user?.patientId}</p>
              <p className="text-sm text-purple-100 mt-2">Last test: January 20, 2024</p>
            </div>
            <div className="hidden md:block">
              <Activity className="w-16 h-16 opacity-50" />
            </div>
          </div>
        </Card>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload New Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onClick={onUploadNew}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[#9333EA] hover:bg-purple-50 transition-all cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Drag & Drop or Click to Upload</h3>
              <p className="text-sm text-gray-600 mb-4">
                Supported formats: JPEG, PNG, TIFF (Max 10MB)
              </p>
              <Button variant="primary">Select File</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Test History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Risk Level</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Doctor</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testHistory.map((test) => (
                        <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{test.date}</td>
                          <td className="py-3 px-4">
                            <Badge variant={test.status as any}>
                              {test.status === 'reviewed' ? '✓ Reviewed' : '⏳ Pending'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {test.riskLevel === 'pending' ? (
                              <Badge variant="pending">Pending</Badge>
                            ) : (
                              <Badge variant={test.riskLevel as any}>
                                {test.riskLevel === 'high' && '🔴 HIGH'}
                                {test.riskLevel === 'medium' && '🟡 MEDIUM'}
                                {test.riskLevel === 'low' && '🟢 LOW'}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{test.doctor}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => onViewResults(test.id)}
                              className="text-[#9333EA] hover:text-[#7C3AED] font-medium text-sm flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Trend */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#9333EA]" />
                  <CardTitle>Risk Trend</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="risk" fill="#9333EA" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Risk Level</span>
                    <span className="font-semibold text-gray-900">23%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Trend</span>
                    <span className="font-semibold text-green-600">↓ Decreasing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#9333EA]" />
                  <CardTitle>Upcoming</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Follow-up</p>
                      <p className="text-xs text-gray-600">Jan 25, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Next Screening</p>
                      <p className="text-xs text-gray-600">Feb 15, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}