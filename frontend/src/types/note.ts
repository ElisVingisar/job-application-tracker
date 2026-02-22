export interface NoteResponse {
  id: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface NoteRequest {
  content: string
}