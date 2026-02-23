import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/api/applications'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import EditApplicationDialog from '@/components/EditApplicationDialog'
import NotesSection from '@/components/NotesSection'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const queryClient = useQueryClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsApi.getById(Number(id)),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => applicationsApi.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      navigate('/applications')
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-sm text-zinc-400 dark:text-zinc-500">Loading...</div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-sm text-red-500 dark:text-red-400">Failed to load application</div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return null
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
      case 'INTERVIEWING':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'OFFER':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'ACCEPTED':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'WITHDRAWN':
        return 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
      default:
        return 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/applications')}
              className="text-zinc-600 dark:text-zinc-400 shrink-0"
            >
              <svg className="h-4 w-4 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </Button>
            <h1 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 truncate">Application Details</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {theme === 'light' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </Button>
            <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">{user?.fullName}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {application.positionTitle}
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-300">{application.companyName}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-8 text-sm">
            {application.location && (
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {application.location}
              </div>
            )}
            {application.workMode && (
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {application.workMode.charAt(0) + application.workMode.slice(1).toLowerCase()}
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Application Info Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4">Application Information</h3>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Application Date</div>
                  <div className="text-sm text-zinc-900 dark:text-zinc-100">{formatDate(application.applicationDate)}</div>
                </div>
                {application.nextStepDate && (
                  <div className="mt-3 sm:mt-0">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Next Step Date</div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100">{formatDate(application.nextStepDate)}</div>
                  </div>
                )}
              </div>
              {application.applicationSource && (
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Application Source</div>
                  <div className="text-sm text-zinc-900 dark:text-zinc-100">{application.applicationSource}</div>
                </div>
              )}
              {application.jobPostingUrl && (
                <div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Job Posting</div>
                  <a
                    href={application.jobPostingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                  >
                    View posting
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Salary Info Card */}
          {(application.salaryMin !== undefined && application.salaryMin !== null) ||
           (application.salaryMax !== undefined && application.salaryMax !== null) ? (
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4">Salary Range</h3>
              <div className="flex gap-8">
                {(application.salaryMin !== undefined && application.salaryMin !== null) && (
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Minimum</div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100">{formatCurrency(application.salaryMin)}</div>
                  </div>
                )}
                {(application.salaryMax !== undefined && application.salaryMax !== null) && (
                  <div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Maximum</div>
                    <div className="text-sm text-zinc-900 dark:text-zinc-100">{formatCurrency(application.salaryMax)}</div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
          <EditApplicationDialog application={application}>
            <Button variant="outline" className="w-full sm:w-auto">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Application
            </Button>
          </EditApplicationDialog>
          <Button
            variant="outline"
            className="w-full sm:w-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
            onClick={() => setShowDeleteDialog(true)}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Application
          </Button>
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <NotesSection applicationId={application.id} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your application for {application.positionTitle} at{' '}
              {application.companyName}? This action cannot be undone and will also delete all associated notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
