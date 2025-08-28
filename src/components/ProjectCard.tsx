import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { TrendingUp, Calendar, Shield, Target, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to default if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${project.image_url ? 'hidden' : ''}`}>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{project.symbol}</div>
            <div className="text-sm text-gray-600">{project.category}</div>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.risk_level)}`}>
            {project.risk_level} Risk
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
            <p className="text-sm text-blue-600 font-medium">{project.symbol} • {project.category}</p>
            <p className="text-xs text-gray-500">by {project.owner_name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Token Price</p>
            <p className="text-lg font-bold text-gray-900">€{project.price_per_token.toFixed(2)}</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                €{project.raised_amount.toLocaleString()} / €{project.target_amount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
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
          
          <div className="flex space-x-3">
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center text-gray-600 mb-1">
                <TrendingUp className="h-4 w-4 mr-1" />
              </div>
              <p className="text-xs text-gray-500">Expected ROI</p>
              <p className="text-sm font-semibold text-green-600">12-18%</p>
            </div>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center text-gray-600 mb-1">
                <Target className="h-4 w-4 mr-1" />
              </div>
              <p className="text-xs text-gray-500">Min Investment</p>
              <p className="text-sm font-semibold text-gray-900">€100</p>
            </div>
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center text-gray-600 mb-1">
                <Shield className="h-4 w-4 mr-1" />
              </div>
              <p className="text-xs text-gray-500">Escrow</p>
              <p className="text-sm font-semibold text-blue-600">Protected</p>
            </div>
          </div>
        </div>

        {project.token_contract_address && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Token Contract</span>
              <a 
                href={apiService.getPolygonscanUrl(project.token_contract_address)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                View <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
            <p className="text-xs text-gray-800 font-mono truncate">{project.token_contract_address}</p>
          </div>
        )}

        {/* Optional Documents */}
        {(project.business_plan_url || project.whitepaper_url) && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {project.business_plan_url && (
                <a 
                  href={project.business_plan_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center bg-white px-2 py-1 rounded border"
                >
                  Business Plan <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              {project.whitepaper_url && (
                <a 
                  href={project.whitepaper_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center bg-white px-2 py-1 rounded border"
                >
                  Whitepaper <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        )}
        
        <button 
          onClick={() => navigate(`/project/${project.id}`)}
          disabled={project.status !== 'ACTIVE'}
          className="w-full mt-6 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {project.status === 'ACTIVE' ? 'Invest Now' : project.status}
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;