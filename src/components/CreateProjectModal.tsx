import React, { useState } from 'react';
import { X, Calendar, DollarSign, Target, FileText, Image, Building2 } from 'lucide-react';
import { CreateProjectRequest } from '../types';
import { apiService } from '../services/api';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProjectRequest>({
    name: '',
    symbol: '',
    description: '',
    category: '',
    target_amount: 0,
    price_per_token: 0,
    total_supply: 0,
    end_date: '',
    risk_level: 'Medium',
    image_url: '',
    business_plan_url: '',
    whitepaper_url: '',
  });

  if (!isOpen) return null;

  const categories = [
    'Clean Energy',
    'Healthcare',
    'Agriculture',
    'Financial Services',
    'Technology',
    'Manufacturing',
    'Real Estate',
    'Education',
    'Transportation',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('amount') || name.includes('token') || name.includes('supply') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only submit if we're on step 3
    if (currentStep !== 3) {
      console.log('Form submission prevented - not on step 3, current step:', currentStep);
      return;
    }
    
    console.log('Submitting project creation on step 3');
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare project data for API - only include optional fields if they have values
      const projectData: CreateProjectRequest = {
        name: formData.name,
        symbol: formData.symbol.toUpperCase(),
        description: formData.description,
        category: formData.category,
        target_amount: formData.target_amount,
        price_per_token: formData.price_per_token,
        total_supply: formData.total_supply,
        end_date: formData.end_date,
        risk_level: formData.risk_level,
        ...(formData.image_url && { image_url: formData.image_url }),
        ...(formData.business_plan_url && { business_plan_url: formData.business_plan_url }),
        ...(formData.whitepaper_url && { whitepaper_url: formData.whitepaper_url }),
      };

      const response = await apiService.createProject(projectData);
      
      if (response.error) {
        setError(response.error);
      } else {
        alert('Project created successfully! It will be reviewed and published within 24 hours.');
        onClose();
        
        // Reset form
        setFormData({
          name: '',
          symbol: '',
          description: '',
          category: '',
          target_amount: 0,
          price_per_token: 0,
          total_supply: 0,
          end_date: '',
          risk_level: 'Medium',
          image_url: '',
          business_plan_url: '',
          whitepaper_url: '',
        });
        setCurrentStep(1);
        
        // Callback to refresh projects list
        if (onProjectCreated) {
          onProjectCreated();
        }
      }
      
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    console.log('Next button clicked, current step:', currentStep);
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      console.log('Moving to step:', currentStep + 1);
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = formData.name && formData.symbol && formData.description && formData.category;
  const isStep2Valid = formData.target_amount > 0 && formData.price_per_token > 0 && formData.total_supply > 0 && formData.end_date;
  
  console.log('Step validation:', { 
    step1: isStep1Valid, 
    step2: isStep2Valid, 
    currentStep,
    formData: {
      name: formData.name,
      symbol: formData.symbol,
      description: formData.description,
      category: formData.category,
      target_amount: formData.target_amount,
      price_per_token: formData.price_per_token,
      total_supply: formData.total_supply,
      end_date: formData.end_date
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token Symbol *
                  </label>
                  <input
                    type="text"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleInputChange}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="e.g., GTS"
                    maxLength={10}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">3-10 characters, will be converted to uppercase</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your project, its goals, and value proposition..."
                    minLength={10}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                </div>
              </div>
            )}

            {/* Step 2: Financial Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount (EUR) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="target_amount"
                        value={formData.target_amount || ''}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1000000"
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Token (EUR) *
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="price_per_token"
                        value={formData.price_per_token || ''}
                        onChange={handleInputChange}
                        step="0.01"
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1.50"
                        min="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Token Supply *
                  </label>
                  <input
                    type="number"
                    name="total_supply"
                    value={formData.total_supply || ''}
                    onChange={handleInputChange}
                    className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000000"
                    min="1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risk Level *
                    </label>
                    <select
                      name="risk_level"
                      value={formData.risk_level}
                      onChange={handleInputChange}
                      className="px-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Low">Low Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="High">High Risk</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents & Media (Optional) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Media (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">These fields are optional. You can add them later or skip this step.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Image URL
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Enter image URL (optional)</p>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url || ''}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Plan URL
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Enter business plan URL (optional)</p>
                    <input
                      type="url"
                      name="business_plan_url"
                      value={formData.business_plan_url || ''}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/business-plan.pdf"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Whitepaper URL
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Enter whitepaper URL (optional)</p>
                    <input
                      type="url"
                      name="whitepaper_url"
                      value={formData.whitepaper_url || ''}
                      onChange={handleInputChange}
                      className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/whitepaper.pdf"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                  currentStep === 1 ? 'invisible' : ''
                }`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;