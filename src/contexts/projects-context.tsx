'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiService } from '@/lib/api';
import type { Project, ProjectsListResponse } from '@/types';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
  limit: number;
  offset: number;
}

interface ProjectsContextType extends ProjectsState {
  loadProjects: (params?: { search?: string; category?: string; limit?: number; offset?: number }) => Promise<void>;
  refreshProjects: () => Promise<void>;
  clearError: () => void;
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

  const loadProjects = useCallback(async (params?: { search?: string; category?: string; limit?: number; offset?: number }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiService.getProjects(params);

      if (response.error) {
        console.error('ProjectsContext: API error:', response.error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Unknown error',
          projects: [],
          total: 0
        }));
        return;
      }

      if (response.data) {
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
          
          try {
                                      projectsArray = response.data.map((project: Record<string, unknown>) => {
               const mappedProject: Project = {
                 id: String(project.id || ''),
                 name: String(project.name || ''),
                 symbol: String(project.symbol || ''),
                 description: String(project.description || ''),
                 category: String(project.category || ''),
                 target_amount: parseFloat(String(project.target_amount || '0')),
                 price_per_token: parseFloat(String(project.price_per_token || '0')),
                 total_supply: Number(project.total_supply || 0),
                 raised_amount: parseFloat(String(project.current_raised || project.raised_amount || '0')),
                 end_date: String(project.end_date || ''),
                 risk_level: String(project.risk_level || 'Medium') as 'Low' | 'Medium' | 'High',
                 status: (String(project.status || 'PENDING').toUpperCase() as 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'),
                 owner_id: String(project.owner_id || ''),
                 owner_name: String(project.owner_name || 'Unknown Owner'),
                 token_contract_address: String(project.token_contract_address || ''),
                 escrow_contract_address: String(project.escrow_contract_address || ''),
                 token_deployment_tx: String(project.token_deployment_tx || ''),
                 escrow_deployment_tx: String(project.escrow_deployment_tx || ''),
                 image_url: project.image_url ? String(project.image_url) : null,
                 business_plan_url: project.business_plan_url ? String(project.business_plan_url) : null,
                 whitepaper_url: project.whitepaper_url ? String(project.whitepaper_url) : null,
                 created_at: String(project.created_at || ''),
                 updated_at: String(project.updated_at || ''),
               };
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
        setState(prev => ({
          ...prev,
          loading: false,
          projects: [],
          total: 0,
          error: 'No projects found'
        }));
      }
    } catch (error) {
      console.error('ProjectsContext: Error loading projects:', error);
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

  const contextValue: ProjectsContextType = {
    ...state,
    loadProjects,
    refreshProjects,
    clearError,
  };

  return (
    <ProjectsContext.Provider value={contextValue}>
      {children}
    </ProjectsContext.Provider>
  );
}; 