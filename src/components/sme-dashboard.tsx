'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, TrendingUp, DollarSign, Users, Target, Loader } from 'lucide-react';
import { useProjects } from '@/contexts/projects-context';
import { apiService } from '@/lib/api';

export default function SMEDashboard() {
  const router = useRouter();
  const { projects, loading, total, loadProjects } = useProjects();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRaised: 0,
    totalInvestors: 0,
    avgPerformance: 0
  });

  useEffect(() => {
    // Load projects for this SME
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    // Calculate stats from projects
    if (projects.length > 0) {
      const totalRaised = projects.reduce((sum, project) => sum + project.raised_amount, 0);
      const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
      
      setStats({
        totalProjects: projects.length,
        totalRaised,
        totalInvestors: Math.floor(totalRaised / 1000), // Estimate based on average investment
        avgPerformance: 18.5 // This would come from backend analytics
      });
    }
  }, [projects]);

  const handleViewAnalytics = () => {
    // For now, just show an alert - this would navigate to analytics page
    alert('Analytics feature coming soon!');
  };

  const handleManageInvestors = () => {
    // For now, just show an alert - this would navigate to investors page
    alert('Investor management feature coming soon!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SME Dashboard</h1>
              <p className="text-gray-600">Manage your token projects and track performance</p>
            </div>
            <Link
              href="/create-project"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Project
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="bg-blue-400 p-3 rounded-lg">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Raised</p>
                  <p className="text-2xl font-bold">€{stats.totalRaised.toLocaleString()}</p>
                </div>
                <div className="bg-green-400 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Investors</p>
                  <p className="text-2xl font-bold">{stats.totalInvestors}</p>
                </div>
                <div className="bg-purple-400 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Performance</p>
                  <p className="text-2xl font-bold">+{stats.avgPerformance}%</p>
                </div>
                <div className="bg-orange-400 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
              {loading && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Create your first project to get started</p>
                <Link
                  href="/create-project"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.slice(0, 5).map(project => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => router.push(`/project/${project.id}`)}>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600">€{project.raised_amount.toLocaleString()} raised</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                ))}
                
                {projects.length > 5 && (
                  <div className="text-center pt-4">
                                    <button
                  onClick={() => router.push('/')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                >
                  View all {projects.length} projects
                </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/create-project"
                className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-blue-900">Create New Project</h3>
                  <p className="text-sm text-blue-700">Launch a new token offering</p>
                </div>
              </Link>
              
              <button
                onClick={handleViewAnalytics}
                className="w-full flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
              >
                <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                <div className="text-left">
                  <h3 className="font-medium text-green-900">View Analytics</h3>
                  <p className="text-sm text-green-700">Track project performance</p>
                </div>
              </button>
              
              <button
                onClick={handleManageInvestors}
                className="w-full flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <div className="text-left">
                  <h3 className="font-medium text-purple-900">Manage Investors</h3>
                  <p className="text-sm text-purple-700">View and communicate with investors</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
