import api from './auth'
import type { ApplicationRequest, ApplicationResponse } from '@/types/application'

export const applicationsApi = {
  // Get all applications for the logged-in user
  getAll: async (): Promise<ApplicationResponse[]> => {
    const response = await api.get('/applications')
    return response.data
  },

  // Get a single application by ID
  getById: async (id: number): Promise<ApplicationResponse> => {
    const response = await api.get(`/applications/${id}`)
    return response.data
  },

  // Create a new application
  create: async (data: ApplicationRequest): Promise<ApplicationResponse> => {
    const response = await api.post('/applications', data)
    return response.data
  },

  // Update an existing application
  update: async (id: number, data: ApplicationRequest): Promise<ApplicationResponse> => {
    const response = await api.put(`/applications/${id}`, data)
    return response.data
  },

  // Delete an application
  delete: async (id: number): Promise<void> => {
    await api.delete(`/applications/${id}`)
  }
}