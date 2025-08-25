import React from 'react';
import { TokenProject } from '../types';
import { TrendingUp, Calendar, Shield, Target } from 'lucide-react';

interface ProjectCardProps {
  project: TokenProject;
  onSelect: (project: TokenProject) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const progressPercentage = (project.currentRaised / project.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={project.image} 
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(project.riskLevel)}`}>
            {project.riskLevel} Risk
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
            <p className="text-sm text-blue-600 font-medium">{project.symbol} • {project.category}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Token Price</p>
            <p className="text-lg font-bold text-gray-900">€{project.pricePerToken}</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                €{project.currentRaised.toLocaleString()} / €{project.targetAmount.toLocaleString()}
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
                {daysLeft} days left
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
        
        <button 
          onClick={() => onSelect(project)}
          className="w-full mt-6 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Invest Now
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;