import { useQuery } from '@tanstack/react-query'
import { applicationsApi } from '@/api/applications'
import { Button } from '@/components/ui/button'
import AddApplicationDialog from '@/components/AddApplicationDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context/AuthContext'
import type { ApplicationStatus } from '@/types/application'

export default function ApplicationsPage() {
  const { user, logout } = useAuth()
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationsApi.getAll,
  })

  // Calculate status counts
  const statusCounts = applications?.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<ApplicationStatus, number>)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-sm text-zinc-400">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-sm text-red-500">Failed to load applications</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium text-zinc-900">Job Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-500">{user?.fullName}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-300 transition-colors">
            <div className="text-2xl font-semibold text-zinc-900">
              {statusCounts?.APPLIED || 0}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Applied</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-300 transition-colors">
            <div className="text-2xl font-semibold text-blue-600">
              {statusCounts?.INTERVIEWING || 0}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Interviewing</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-300 transition-colors">
            <div className="text-2xl font-semibold text-green-600">
              {statusCounts?.OFFER || 0}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Offers</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-zinc-200 hover:border-zinc-300 transition-colors">
            <div className="text-2xl font-semibold text-zinc-900">
              {applications?.length || 0}
            </div>
            <div className="text-sm text-zinc-500 mt-1">Total</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-zinc-600">Recent Applications</h2>
          <AddApplicationDialog>
            <Button size="sm">Add Application</Button>
          </AddApplicationDialog>
        </div>

        {/* Applications List */}
        {applications && applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-16 text-center">
            <div className="text-zinc-400 mb-4">
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
            <p className="text-sm text-zinc-500 mb-1">No applications yet</p>
            <p className="text-xs text-zinc-400">Start tracking your job search journey</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-200">
                  <TableHead className="text-xs font-medium text-zinc-500">Company</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500">Position</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500">Status</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500">Applied</TableHead>
                  <TableHead className="text-xs font-medium text-zinc-500"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications?.map((app) => (
                  <TableRow key={app.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                    <TableCell className="font-medium text-zinc-900">{app.companyName}</TableCell>
                    <TableCell className="text-zinc-600">{app.positionTitle}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        app.status === 'APPLIED' ? 'bg-zinc-100 text-zinc-700' :
                        app.status === 'INTERVIEWING' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'OFFER' ? 'bg-green-100 text-green-700' :
                        app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-zinc-100 text-zinc-700'
                      }`}>
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm">
                      {new Date(app.applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-600">
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
