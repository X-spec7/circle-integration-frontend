import React, { useState } from 'react';
import { TokenProject } from '../types';
import { X, Shield, TrendingUp, Calendar, MapPin, Users, Target, ExternalLink } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface ProjectModalProps {
  project: TokenProject;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  
  const progressPercentage = (project.currentRaised / project.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const tokensToReceive = Math.floor(investmentAmount / project.pricePerToken);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (showPayment) {
    return (
      <PaymentModal
        project={project}
        amount={investmentAmount}
        tokensToReceive={tokensToReceive}
        onClose={() => setShowPayment(false)}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img 
            src={project.image} 
            alt={project.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white bg-opacity-95 backdrop-blur rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h2>
                  <p className="text-blue-600 font-medium">{project.symbol} • {project.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(project.riskLevel)}`}>
                  {project.riskLevel} Risk
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Project Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Project</h3>
            <p className="text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">€{project.pricePerToken}</div>
              <div className="text-sm text-gray-600">Token Price</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{project.totalSupply.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Supply</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">15%</div>
              <div className="text-sm text-gray-600">Expected ROI</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{daysLeft}</div>
              <div className="text-sm text-gray-600">Days Left</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Funding Progress</span>
              <span className="text-sm text-gray-600">
                €{project.currentRaised.toLocaleString()} / €{project.targetAmount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">{progressPercentage.toFixed(1)}% funded</span>
              <span className="text-sm text-gray-500">342 investors</span>
            </div>
          </div>

          {/* Investment Section */}
          <div className="bg-blue-50 p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Your Investment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount (EUR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    step="10"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="pl-8 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum investment: €100</p>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Tokens you'll receive:</span>
                  <span className="font-semibold text-gray-900">{tokensToReceive.toLocaleString()} {project.symbol}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Token price:</span>
                  <span className="text-sm text-gray-900">€{project.pricePerToken}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Platform fee (2%):</span>
                  <span className="text-sm text-gray-900">€{(investmentAmount * 0.02).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPayment(true)}
                disabled={investmentAmount < 100}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Proceed to Payment
              </button>
            </div>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Escrow Protected</p>
                <p className="text-xs text-green-700">Funds secured in smart contract</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Polygon Network</p>
                <p className="text-xs text-blue-700">Low fees, fast transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900">Verified Project</p>
                <p className="text-xs text-purple-700">Due diligence completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;