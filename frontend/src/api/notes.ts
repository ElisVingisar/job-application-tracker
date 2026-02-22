import api from './auth'
import type { NoteRequest, NoteResponse } from '@/types/note'

export const notesApi = {
  // Get all notes for a specific application
  getByApplicationId: async (applicationId: number): Promise<NoteResponse[]> => {
    const response = await api.get(`/applications/${applicationId}/notes`)
    return response.data
  },

  // Get a single note by ID
  getById: async (applicationId: number, noteId: number): Promise<NoteResponse> => {
    const response = await api.get(`/applications/${applicationId}/notes/${noteId}`)
    return response.data
  },

  // Create a new note
  create: async (applicationId: number, data: NoteRequest): Promise<NoteResponse> => {
    const response = await api.post(`/applications/${applicationId}/notes`, data)
    return response.data
  },

  // Update an existing note
  update: async (applicationId: number, noteId: number, data: NoteRequest): Promise<NoteResponse> => {
    const response = await api.put(`/applications/${applicationId}/notes/${noteId}`, data)
    return response.data
  },

  // Delete a note
  delete: async (applicationId: number, noteId: number): Promise<void> => {
    await api.delete(`/applications/${applicationId}/notes/${noteId}`)
  }
}