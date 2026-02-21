export type ApplicationStatus = 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'

export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID'

export interface ApplicationResponse {
  id: number
  companyName: string
  positionTitle: string
  location?: string
  workMode?: WorkMode
  applicationSource?: string
  jobPostingUrl?: string
  salaryMin?: number
  salaryMax?: number
  status: ApplicationStatus
  applicationDate: string
  nextStepDate?: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationRequest {
  companyName: string
  positionTitle: string
  location?: string
  workMode?: WorkMode
  applicationSource?: string
  jobPostingUrl?: string
  salaryMin?: number
  salaryMax?: number
  status: ApplicationStatus
  applicationDate: string
  nextStepDate?: string
}
