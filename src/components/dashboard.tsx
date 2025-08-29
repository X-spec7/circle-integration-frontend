'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, DollarSign, Users, Target, Loader } from 'lucide-react';
import { useProjects } from '@/contexts/projects-context';
import { useRouter } from 'next/navigation';
import PaymentModal from './payment-modal';
import type { Project } from '@/types';

export default function Dashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { 
    projects, 
    loading, 
    error, 
    total, 
    loadProjects, 
    refreshProjects, 
    clearError 
  } = useProjects();



  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load projects when filters change
  useEffect(() => {
    loadProjects({
      search: debouncedSearchTerm || undefined,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
    });
  }, [selectedCategory, debouncedSearchTerm, loadProjects]);

  // Get unique categories from projects
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  // Calculate stats
  const totalRaised = projects.reduce((sum, project) => sum + project.raised_amount, 0);
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;

  const handleInvestClick = (project: Project) => {
    setSelectedProject(project);
    setShowPaymentModal(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Projects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshProjects}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Raised</p>
                  <p className="text-2xl font-bold">€{totalRaised.toLocaleString()}</p>
                </div>
                <div className="bg-blue-400 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Active Projects</p>
                  <p className="text-2xl font-bold">{activeProjects}</p>
                </div>
                <div className="bg-green-400 p-3 rounded-lg">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Projects</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
                <div className="bg-purple-400 p-3 rounded-lg">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Returns</p>
                  <p className="text-2xl font-bold">15.3%</p>
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
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Investment Opportunities</h2>
          <p className="text-gray-600">Discover and invest in promising token projects on Polygon network</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-blue-600">{project.symbol} • {project.category}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">
                      €{project.raised_amount.toLocaleString()} / €{project.target_amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((project.raised_amount / project.target_amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Token Price</span>
                    <span className="font-medium">€{project.price_per_token.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <button 
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                    onClick={() => router.push(`/project/${project.id}`)}
                  >
                    View Details
                  </button>
                  <button 
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    disabled={project.status !== 'ACTIVE'}
                    onClick={() => handleInvestClick(project)}
                  >
                    {project.status === 'ACTIVE' ? 'Invest Now' : project.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedProject && (
        <PaymentModal
          project={selectedProject}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
} 