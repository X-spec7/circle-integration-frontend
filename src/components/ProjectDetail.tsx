import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Target, TrendingUp, Shield, ExternalLink, DollarSign, Coins } from 'lucide-react';
import { Project } from '../types';
import { apiService } from '../services/api';
import PaymentModal from './PaymentModal';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  console.log('ProjectDetail render:', { id, project, loading, error, showPaymentModal });

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      console.log('Loading project with ID:', id);
      
      const response = await apiService.getProject(id!);
      console.log('Project API response:', response);
      
      if (response.error) {
        console.error('Project API error:', response.error);
        setError(response.error);
      } else if (response.data) {
        console.log('Project data received:', response.data);
        
        // Handle different possible response formats
        let projectData: any;
        
        if (Array.isArray(response.data)) {
          // If response is an array, take the first item
          projectData = response.data[0];
        } else if (typeof response.data === 'object') {
          // If response is an object, use it directly
          projectData = response.data;
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Invalid project data format');
          return;
        }
        
        // Map backend field names to frontend types if needed
        const mappedProject: Project = {
          ...projectData,
          // Map current_raised to raised_amount
          raised_amount: typeof projectData.current_raised === 'string' 
            ? parseFloat(projectData.current_raised) 
            : (projectData.raised_amount || 0),
          target_amount: typeof projectData.target_amount === 'string' 
            ? parseFloat(projectData.target_amount) 
            : projectData.target_amount,
          price_per_token: typeof projectData.price_per_token === 'string' 
            ? parseFloat(projectData.price_per_token) 
            : projectData.price_per_token,
          // Map status from lowercase to uppercase
          status: (projectData.status?.toUpperCase() as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') || 'PENDING',
          // Add missing fields with defaults
          owner_name: projectData.owner_name || 'Unknown Owner',
          token_deployment_tx: projectData.token_deployment_tx || '',
          escrow_deployment_tx: projectData.escrow_deployment_tx || '',
        };
        
        console.log('Mapped project data:', mappedProject);
        setProject(mappedProject);
      } else {
        console.error('No project data in response');
        setError('Project not found');
      }
    } catch (error) {
      console.error('Project loading error:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
          <p className="text-sm text-gray-500 mt-2">Project ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    console.log('ProjectDetail showing error state:', { error, project });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
          <p className="text-sm text-gray-500 mb-4">Project ID: {id}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = (project.raised_amount / project.target_amount) * 100;
  const daysLeft = Math.ceil((new Date(project.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  console.log('ProjectDetail about to render main content');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                  <p className="text-lg text-blue-600 font-medium mb-1">{project.symbol} • {project.category}</p>
                  <p className="text-sm text-gray-500">by {project.owner_name}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(project.risk_level)}`}>
                    {project.risk_level} Risk
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{project.description}</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    €{project.raised_amount.toLocaleString()} / €{project.target_amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{progressPercentage.toFixed(1)}% funded</span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Token Price</h3>
                  <p className="text-2xl font-bold text-gray-900">€{project.price_per_token.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Supply</h3>
                  <p className="text-2xl font-bold text-gray-900">{project.total_supply.toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Expected ROI</h3>
                  <p className="text-2xl font-bold text-green-600">12-18%</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Min Investment</h3>
                  <p className="text-2xl font-bold text-gray-900">€100</p>
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Blockchain Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Token Contract</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-800 font-mono truncate">{project.token_contract_address}</p>
                    <a 
                      href={apiService.getPolygonscanUrl(project.token_contract_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      View <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Escrow Contract</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-800 font-mono truncate">{project.escrow_contract_address}</p>
                    <a 
                      href={apiService.getPolygonscanUrl(project.escrow_contract_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      View <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Investment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Invest Now</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Token Price</span>
                  <span className="font-medium">€{project.price_per_token.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Tokens</span>
                  <span className="font-medium">{(project.total_supply - (project.raised_amount / project.price_per_token)).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min Investment</span>
                  <span className="font-medium">€100</span>
                </div>
              </div>

              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={project.status !== 'ACTIVE'}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {project.status === 'ACTIVE' ? 'Proceed to Payment' : project.status}
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-800">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Funds Protected by Escrow</span>
                </div>
              </div>
            </div>

            {/* Project Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Project Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">End Date</span>
                  <span className="text-sm font-medium">
                    {new Date(project.end_date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.risk_level)}`}>
                    {project.risk_level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          project={project}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail; 