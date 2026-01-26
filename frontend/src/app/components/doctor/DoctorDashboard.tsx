import React, { useState } from 'react';
import { Bell, Settings, LogOut, Activity, Search, Filter, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/context/AuthContext';

interface DoctorDashboardProps {
  onReviewCase: (caseId: string) => void;
}

// Mock data
const cases = [
  {
    id: 'C001',
    patientName: 'Sarah Johnson',
    age: 45,
    mrn: 'MRN-2024-001',
    riskLevel: 'high',
    status: 'pending',
    uploadDate: '2024-01-24',
    priority: true,
  },
  {
    id: 'C002',
    patientName: 'Emma Williams',
    age: 52,
    mrn: 'MRN-2024-002',
    riskLevel: 'medium',
    status: 'in-review',
    uploadDate: '2024-01-23',
    priority: false,
  },
  {
    id: 'C003',
    patientName: 'Lisa Brown',
    age: 38,
    mrn: 'MRN-2024-003',
    riskLevel: 'low',
    status: 'pending',
    uploadDate: '2024-01-22',
    priority: false,
  },
];

const stats = [
  {
    label: 'Cases Reviewed',
    value: '127',
    icon: '📋',
    change: '+12 this week',
  },
  {
    label: 'Avg Response Time',
    value: '2.4h',
    icon: '⏱️',
    change: '-0.3h from last week',
  },
  {
    label: 'Urgent Cases',
    value: '3',
    icon: '🚨',
    change: '2 require immediate attention',
  },
];

export function DoctorDashboard({ onReviewCase }: DoctorDashboardProps) {
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-review' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchQuery && !c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) && !c.mrn.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-[#2563EB]" />
              <span className="text-xl font-bold text-gray-900">Tawhida</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Doctor Portal
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#2563EB] to-[#4F46E5] rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name.split(' ').map(n => n[0]).join('')}
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
        {/* Welcome Card */}
        <Card gradient="blue">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
              <p className="text-blue-100">{user?.specialization} • License: {user?.licenseNumber}</p>
            </div>
            <div className="hidden md:block">
              <Activity className="w-16 h-16 opacity-50" />
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-4xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Urgent Cases Alert */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">High Priority Cases Require Attention</h3>
                <p className="text-sm text-red-700 mb-3">
                  1 case with high-risk indicators needs immediate review
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onReviewCase('C001')}
                >
                  Review Now →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Cases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Cases</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              {['all', 'pending', 'in-review', 'closed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 font-medium transition-all ${
                    filter === f
                      ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                  {f === 'pending' && ' (3)'}
                </button>
              ))}
            </div>

            {/* Cases Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Case ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Age</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Risk Level</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Uploaded</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((case_) => (
                    <tr
                      key={case_.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        case_.priority ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {case_.priority && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium text-gray-900">{case_.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{case_.patientName}</p>
                          <p className="text-xs text-gray-500">{case_.mrn}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{case_.age}</td>
                      <td className="py-3 px-4">
                        <Badge variant={case_.riskLevel as any}>
                          {case_.riskLevel === 'high' && '🔴 HIGH'}
                          {case_.riskLevel === 'medium' && '🟡 MEDIUM'}
                          {case_.riskLevel === 'low' && '🟢 LOW'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={case_.status === 'pending' ? 'pending' : 'reviewed'}>
                          {case_.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{case_.uploadDate}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="blue"
                          size="sm"
                          onClick={() => onReviewCase(case_.id)}
                        >
                          Review →
                        </Button>
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
