import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Users, Target, BarChart3, Calendar, Settings } from 'lucide-react';
import CreateProjectModal from './CreateProjectModal';

const SMEDashboard = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);

  // Mock data for SME's projects
  const myProjects = [
    {
      id: '1',
      name: 'GreenTech Solutions',
      symbol: 'GTS',
      status: 'Active',
      raised: 750000,
      target: 1000000,
      investors: 342,
      daysLeft: 45,
    },
    {
      id: '2',
      name: 'Smart Agriculture',
      symbol: 'SAG',
      status: 'Under Review',
      raised: 0,
      target: 500000,
      investors: 0,
      daysLeft: 0,
    }
  ];

  const totalRaised = myProjects.reduce((sum, project) => sum + project.raised, 0);
  const totalInvestors = myProjects.reduce((sum, project) => sum + project.investors, 0);
  const activeProjects = myProjects.filter(p => p.status === 'Active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SME Dashboard</h1>
              <p className="text-gray-600">Manage your fundraising projects</p>
            </div>
            <button
              onClick={() => setShowCreateProject(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Project</span>
            </button>
          </div>

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
                  <p className="text-2xl font-bold text-gray-900">{totalInvestors}</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">75%</p>
                </div>
                <div className="bg-orange-500 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Projects</h2>
          <p className="text-gray-600">Track the performance of your fundraising campaigns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myProjects.map(project => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{project.symbol}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'Under Review'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>

              {project.status === 'Active' && (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        €{project.raised.toLocaleString()} / €{project.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(project.raised / project.target) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {((project.raised / project.target) * 100).toFixed(1)}% funded
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {project.daysLeft} days left
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{project.investors}</div>
                      <div className="text-xs text-gray-500">Investors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        €{(project.raised / project.investors || 0).toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">Avg. Investment</div>
                    </div>
                  </div>
                </>
              )}

              {project.status === 'Under Review' && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your project is currently under review. You'll be notified once it's approved and goes live.
                  </p>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Create New Project Card */}
          <div 
            onClick={() => setShowCreateProject(true)}
            className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Project</h3>
              <p className="text-sm text-gray-600">Launch a new fundraising campaign</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
      />
    </div>
  );
};

export default SMEDashboard;