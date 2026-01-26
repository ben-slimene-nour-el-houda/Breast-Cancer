import React, { useState } from 'react';
import { Activity, Bell, Settings, LogOut, Eye, Filter, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';

interface MyTestsScreenProps {
  onViewResults: (testId: string) => void;
  onNavigate: (view: string) => void;
}

const allTests = [
  {
    id: 'T001',
    date: '2024-01-20',
    status: 'reviewed',
    riskLevel: 'low',
    doctor: 'Dr. Chen',
    uploadTime: '10:30 AM',
    reviewedTime: '2:15 PM',
  },
  {
    id: 'T002',
    date: '2024-01-15',
    status: 'reviewed',
    riskLevel: 'medium',
    doctor: 'Dr. Smith',
    uploadTime: '9:45 AM',
    reviewedTime: '4:20 PM',
  },
  {
    id: 'T003',
    date: '2024-01-10',
    status: 'pending',
    riskLevel: 'pending',
    doctor: '-',
    uploadTime: '11:20 AM',
    reviewedTime: '-',
  },
  {
    id: 'T004',
    date: '2024-01-05',
    status: 'reviewed',
    riskLevel: 'low',
    doctor: 'Dr. Chen',
    uploadTime: '2:30 PM',
    reviewedTime: '5:45 PM',
  },
  {
    id: 'T005',
    date: '2023-12-20',
    status: 'reviewed',
    riskLevel: 'low',
    doctor: 'Dr. Wilson',
    uploadTime: '8:15 AM',
    reviewedTime: '1:30 PM',
  },
];

export function MyTestsScreen({ onViewResults, onNavigate }: MyTestsScreenProps) {
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState<'all' | 'reviewed' | 'pending'>('all');

  const filteredTests = allTests.filter(test => {
    if (filter === 'all') return true;
    return test.status === filter;
  });

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
              <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-gray-900">Dashboard</button>
              <button onClick={() => onNavigate('my-tests')} className="text-gray-900 font-medium border-b-2 border-[#9333EA] pb-1">My Tests</button>
              <button onClick={() => onNavigate('upload')} className="text-gray-600 hover:text-gray-900">Upload</button>
              <button onClick={() => onNavigate('profile')} className="text-gray-600 hover:text-gray-900">Profile</button>
            </nav>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tests</h1>
            <p className="text-gray-600">View all your pathology test results and history</p>
          </div>
          <Button variant="primary" onClick={() => onNavigate('upload')}>
            Upload New Test
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">{allTests.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Reviewed</p>
              <p className="text-3xl font-bold text-green-600">
                {allTests.filter(t => t.status === 'reviewed').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {allTests.filter(t => t.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Latest Test</p>
              <p className="text-lg font-bold text-gray-900">{allTests[0].date}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tests List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Test History</CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-[#9333EA] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('reviewed')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    filter === 'reviewed'
                      ? 'bg-[#9333EA] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Reviewed
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    filter === 'pending'
                      ? 'bg-[#9333EA] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Test ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Upload Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Risk Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Doctor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Reviewed At</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{test.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{test.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{test.uploadTime}</td>
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
                      <td className="py-3 px-4 text-sm text-gray-600">{test.reviewedTime}</td>
                      <td className="py-3 px-4">
                        {test.status === 'reviewed' ? (
                          <button
                            onClick={() => onViewResults(test.id)}
                            className="text-[#9333EA] hover:text-[#7C3AED] font-medium text-sm flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">In Progress</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
