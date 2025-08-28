import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { useProjects } from '../contexts/ProjectsContext';
import ProjectCard from './ProjectCard';
import { Search, Filter, TrendingUp, DollarSign, Users, Target, Loader } from 'lucide-react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null);
  
  const { 
    projects, 
    loading, 
    error, 
    total, 
    loadProjects, 
    refreshProjects, 
    clearError 
  } = useProjects();

  console.log('Dashboard render:', { 
    projectsCount: projects.length, 
    loading, 
    error, 
    searchTerm, 
    selectedCategory,
    projects: projects
  });

  // Error boundary for rendering
  if (renderError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-4">{renderError}</p>
          <button
            onClick={() => setRenderError(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load projects when filters change
  useEffect(() => {
    const filters: any = {};
    
    if (selectedCategory !== 'All') {
      filters.category = selectedCategory;
    }
    
    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }
    
    console.log('Loading projects with filters:', filters);
    loadProjects(filters);
  }, [selectedCategory, debouncedSearchTerm, loadProjects]);

  // Get unique categories from projects
  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const totalRaised = projects.reduce((sum, project) => sum + project.raised_amount, 0);
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const totalInvestors = 1247; // Mock data - could be fetched from API

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading projects</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshProjects}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Stats Section */}
        <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalRaised.toLocaleString()}</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Investors</p>
                  <p className="text-2xl font-bold text-gray-900">{totalInvestors.toLocaleString()}</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Avg. Returns</p>
                  <p className="text-2xl font-bold text-gray-900">15.3%</p>
                </div>
                <div className="bg-orange-500 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>


    </div>
  );
  } catch (error) {
    console.error('Dashboard rendering error:', error);
    setRenderError(error instanceof Error ? error.message : 'Unknown rendering error');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-4">Something went wrong rendering the dashboard.</p>
          <button
            onClick={() => setRenderError(null)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
};

export default Dashboard;