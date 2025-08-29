'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, DollarSign, Users, Target, TrendingUp } from 'lucide-react';
import { apiService } from '@/lib/api';
import type { Project } from '@/types';
import PaymentModal from '@/components/payment-modal';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  console.log('ProjectDetail render:', { id, project, loading, error });

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        console.log('Loading project with ID:', id);
        const response = await apiService.getProject(id);
        console.log('Project API response:', response);
        
        if (response.error) {
          console.error('Project API error:', response.error);
          setError(response.error);
        } else if (response.data) {
          console.log('Project data received:', response.data);
          let projectData: any;
          
          if (Array.isArray(response.data)) {
            projectData = response.data[0] as unknown as Record<string, unknown>;
          } else if (typeof response.data === 'object' && response.data !== null) {
            projectData = response.data as unknown as Record<string, unknown>;
          } else {
            console.error('Unexpected response format:', response.data);
            setError('Invalid project data format');
            return;
          }
          
          const mappedProject: Project = {
            ...projectData,
            raised_amount: typeof projectData.current_raised === 'string' 
              ? parseFloat(projectData.current_raised) 
              : (projectData.raised_amount || 0),
            target_amount: typeof projectData.target_amount === 'string' 
              ? parseFloat(projectData.target_amount) 
              : projectData.target_amount,
            price_per_token: typeof projectData.price_per_token === 'string' 
              ? parseFloat(projectData.price_per_token) 
              : projectData.price_per_token,
            status: (projectData.status?.toUpperCase() as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') || 'PENDING',
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

    if (id) {
      loadProject();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Project</h3>
          <p className="text-gray-600 mb-4">{error || 'Project not found'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((project.raised_amount / project.target_amount) * 100, 100);
  const tokensAvailable = Math.floor(project.target_amount / project.price_per_token);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-lg text-blue-600 mb-2">{project.symbol} • {project.category}</p>
              <p className="text-gray-600">{project.description}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              project.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
              project.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Project Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Target Amount</p>
                  <p className="text-lg font-bold text-gray-900">€{project.target_amount.toLocaleString()}</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-lg w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Raised Amount</p>
                  <p className="text-lg font-bold text-gray-900">€{project.raised_amount.toLocaleString()}</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Token Price</p>
                  <p className="text-lg font-bold text-gray-900">€{project.price_per_token.toFixed(2)}</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-orange-100 p-3 rounded-lg w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total Supply</p>
                  <p className="text-lg font-bold text-gray-900">{tokensAvailable.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Funding Progress</h3>
                <span className="text-sm text-gray-600">{progressPercentage.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>€{project.raised_amount.toLocaleString()} raised</span>
                <span>€{project.target_amount.toLocaleString()} goal</span>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Project Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <span className="font-medium">{project.risk_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{new Date(project.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-medium">{project.owner_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Invest in this Project</h3>
              
              {project.status === 'ACTIVE' ? (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Invest Now
                </button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-2">This project is not accepting investments</p>
                  <span className="text-sm text-gray-500">Status: {project.status}</span>
                </div>
              )}
            </div>

            {/* Contract Links */}
            {(project.token_contract_address || project.escrow_contract_address) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Smart Contracts</h3>
                <div className="space-y-3">
                  {project.token_contract_address && (
                    <a
                      href={apiService.getPolygonscanUrl(project.token_contract_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-600">Token Contract</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  
                  {project.escrow_contract_address && (
                    <a
                      href={apiService.getPolygonscanUrl(project.escrow_contract_address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm text-gray-600">Escrow Contract</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && project && (
        <PaymentModal
          project={project}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
} 