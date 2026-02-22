import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { applicationsApi } from '@/api/applications'
import { Button } from '@/components/ui/button'
import AddApplicationDialog from '@/components/AddApplicationDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import type { ApplicationStatus, WorkMode } from '@/types/application'

type SortField = 'date' | 'company' | 'position' | 'salary'

export default function ApplicationsPage() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [workModeFilter, setWorkModeFilter] = useState<WorkMode | 'all'>('all')

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getAll,
  })

  // Filter and sort applications
  const sortedApplications = useMemo(() => {
    if (!applications) return []

    // First filter by status and work mode
    let filtered = applications
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }
    if (workModeFilter !== 'all') {
      filtered = filtered.filter(app => app.workMode === workModeFilter)
    }

    // Then sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'date':
          // First try to sort by applicationDate, then by createdAt for same-day applications
          const dateComparison = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
          if (dateComparison !== 0) {
            comparison = dateComparison
          } else {
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          }
          break
        case 'company':
          comparison = a.companyName.localeCompare(b.companyName)
          break
        case 'position':
          comparison = a.positionTitle.localeCompare(b.positionTitle)
          break
        case 'salary':
          // Sort by minimum salary, treating undefined/null as 0
          const salaryA = a.salaryMin ?? 0
          const salaryB = b.salaryMin ?? 0
          comparison = salaryA - salaryB
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [applications, sortField, sortOrder, statusFilter, workModeFilter])

  // Calculate status counts
  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-sm text-zinc-400 dark:text-zinc-500">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-sm text-red-500 dark:text-red-400">Failed to load applications</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Job Tracker</h1>
          <div className="flex items-center gap-4">
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
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{user?.fullName}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
            <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {statusCounts?.APPLIED || 0}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Applied</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
            <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {statusCounts?.INTERVIEWING || 0}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Interviewing</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
            <div className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {statusCounts?.OFFER || 0}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Offers</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
            <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {applications?.length || 0}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Total</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Recent Applications</h2>
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('APPLIED')}>
                  Applied
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('INTERVIEWING')}>
                  Interviewing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('OFFER')}>
                  Offer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('ACCEPTED')}>
                  Accepted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('REJECTED')}>
                  Rejected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('WITHDRAWN')}>
                  Withdrawn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Work Mode Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Mode: {workModeFilter === 'all' ? 'All' : workModeFilter.charAt(0) + workModeFilter.slice(1).toLowerCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setWorkModeFilter('all')}>
                  All Modes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkModeFilter('REMOTE')}>
                  Remote
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkModeFilter('HYBRID')}>
                  Hybrid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWorkModeFilter('ONSITE')}>
                  Onsite
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Sort: {sortField === 'date' ? 'Date' : sortField === 'company' ? 'Company' : sortField === 'position' ? 'Position' : 'Salary'}
                  {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { setSortField('date'); setSortOrder('desc') }}>
                  Date (Newest First)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortField('date'); setSortOrder('asc') }}>
                  Date (Oldest First)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortField('company'); setSortOrder('asc') }}>
                  Company (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortField('company'); setSortOrder('desc') }}>
                  Company (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortField('position'); setSortOrder('asc') }}>
                  Position (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortField('position'); setSortOrder('desc') }}>
                  Position (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortField('salary'); setSortOrder('desc') }}>
                  Salary (Highest First)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSortField('salary'); setSortOrder('asc') }}>
                  Salary (Lowest First)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AddApplicationDialog>
              <Button size="sm">Add Application</Button>
            </AddApplicationDialog>
          </div>
        </div>

        {/* Applications List */}
        {applications && applications.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-16 text-center">
            <div className="text-zinc-400 dark:text-zinc-500 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">No applications yet</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Start tracking your job search journey</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-200 dark:border-zinc-700">
                  <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Company</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Position</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Work Mode</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Salary</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Applied</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500 dark:text-zinc-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplications.map((app) => (
                  <TableRow
                    key={app.id}
                    className="border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/applications/${app.id}`)}
                  >
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{app.companyName}</TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-300">{app.positionTitle}</TableCell>
                    <TableCell>
                      {app.workMode ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.workMode === 'REMOTE' ? 'bg-stone-100 dark:bg-amber-900/20 text-stone-700 dark:text-stone-300' :
                          app.workMode === 'HYBRID' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-yellow-500' :
                          'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                        }`}>
                          {app.workMode.charAt(0) + app.workMode.slice(1).toLowerCase()}
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-zinc-600 dark:text-zinc-300 text-sm">
                      {app.salaryMin !== undefined && app.salaryMin !== null ? (
                        <>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'EUR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(app.salaryMin)}
                          {app.salaryMax !== undefined && app.salaryMax !== null && app.salaryMax !== app.salaryMin && (
                            <> - {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'EUR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(app.salaryMax)}</>
                          )}
                        </>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.status === 'APPLIED' ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300' :
                        app.status === 'INTERVIEWING' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        app.status === 'OFFER' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        app.status === 'ACCEPTED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        app.status === 'REJECTED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}>
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-500 dark:text-zinc-400 text-sm">
                      {new Date(app.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
