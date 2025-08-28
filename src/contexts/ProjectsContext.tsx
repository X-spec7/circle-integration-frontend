import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, ProjectsListResponse } from '../types';
import { apiService } from '../services/api';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  limit: number;
  offset: number;
}

interface ProjectsContextType extends ProjectsState {
  loadProjects: (filters?: ProjectFilters) => Promise<void>;
  refreshProjects: () => Promise<void>;
  clearError: () => void;
}

interface ProjectFilters {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    loading: false,
    error: null,
    total: 0,
    limit: 10,
    offset: 0,
  });

  const loadProjects = useCallback(async (filters?: ProjectFilters) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      console.log('Loading projects with filters:', filters);
      
      const response = await apiService.getProjects(filters);
      console.log('Projects API response:', response);
      
      if (response.error) {
        console.error('Projects API error:', response.error);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: response.error || 'Unknown error',
          projects: [],
          total: 0 
        }));
      } else if (response.data) {
        console.log('Projects data:', response.data);
        
        // Handle different possible response formats
        let projectsArray: Project[] = [];
        let total = 0;
        let limit = 10;
        let offset = 0;
        
        if (response.data.projects && Array.isArray(response.data.projects)) {
          projectsArray = response.data.projects;
          total = response.data.total || 0;
          limit = response.data.limit || 10;
          offset = response.data.offset || 0;
        } else if (Array.isArray(response.data)) {
          // API returns array directly
          console.log('Processing array response:', response.data);
          
          try {
            projectsArray = response.data.map((project: any) => {
              console.log('Processing project:', project);
              const mappedProject = {
                ...project,
                // Map backend field names to frontend types
                raised_amount: parseFloat(project.current_raised || '0'),
                target_amount: parseFloat(project.target_amount || '0'),
                price_per_token: parseFloat(project.price_per_token || '0'),
                // Ensure status is uppercase
                status: project.status?.toUpperCase() || 'PENDING',
                // Add missing fields with defaults
                owner_name: project.owner_name || 'Unknown Owner',
                token_deployment_tx: project.token_deployment_tx || '',
                escrow_deployment_tx: project.escrow_deployment_tx || '',
              };
              console.log('Mapped project:', mappedProject);
              return mappedProject;
            });
            total = response.data.length;
          } catch (mappingError) {
            console.error('Error mapping projects:', mappingError);
            projectsArray = [];
            total = 0;
          }
        } else {
          console.warn('Unexpected response format:', response.data);
          projectsArray = [];
          total = 0;
        }
        
        console.log('Processed projects:', { projectsArray, total, limit, offset });
        
        try {
          setState(prev => ({
            ...prev,
            loading: false,
            projects: projectsArray,
            total,
            limit,
            offset,
            error: null
          }));
        } catch (error) {
          console.error('Error setting projects state:', error);
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Error processing projects data',
            projects: [],
            total: 0
          }));
        }
      } else {
        console.log('No data in response');
        setState(prev => ({
          ...prev,
          loading: false,
          projects: [],
          total: 0,
          error: null
        }));
      }
    } catch (error) {
      console.error('Exception loading projects:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load projects',
        projects: [],
        total: 0
      }));
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const value: ProjectsContextType = {
    ...state,
    loadProjects,
    refreshProjects,
    clearError,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}; 