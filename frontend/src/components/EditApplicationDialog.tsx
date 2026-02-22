import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { applicationsApi } from '@/api/applications'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ApplicationRequest, ApplicationResponse, WorkMode, ApplicationStatus } from '@/types/application'

const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  positionTitle: z.string().min(1, 'Position title is required'),
  location: z.string().optional(),
  workMode: z.enum(['ONSITE', 'REMOTE', 'HYBRID']).nullable().optional(),
  applicationSource: z.string().optional(),
  jobPostingUrl: z.union([z.literal(''), z.string().url('Must be a valid URL')]).optional(),
  salaryMin: z.string()
    .optional()
    .refine((val) => !val || val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Must be a positive number'
    }),
  salaryMax: z.string()
    .optional()
    .refine((val) => !val || val === '' || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: 'Must be a positive number'
    }),
  status: z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']),
  applicationDate: z.string().min(1, 'Application date is required'),
  nextStepDate: z.string().optional(),
})

interface EditApplicationDialogProps {
  application: ApplicationResponse
  children: React.ReactNode
}

export default function EditApplicationDialog({ application, children }: EditApplicationDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: application.companyName,
      positionTitle: application.positionTitle,
      location: application.location || '',
      workMode: application.workMode,
      applicationSource: application.applicationSource || '',
      jobPostingUrl: application.jobPostingUrl || '',
      salaryMin: application.salaryMin?.toString() || '',
      salaryMax: application.salaryMax?.toString() || '',
      status: application.status,
      applicationDate: application.applicationDate,
      nextStepDate: application.nextStepDate || '',
    },
  })

  // Reset form when dialog opens with fresh data
  useEffect(() => {
    if (open) {
      form.reset({
        companyName: application.companyName,
        positionTitle: application.positionTitle,
        location: application.location || '',
        workMode: application.workMode,
        applicationSource: application.applicationSource || '',
        jobPostingUrl: application.jobPostingUrl || '',
        salaryMin: application.salaryMin?.toString() || '',
        salaryMax: application.salaryMax?.toString() || '',
        status: application.status,
        applicationDate: application.applicationDate,
        nextStepDate: application.nextStepDate || '',
      })
    }
  }, [open, application, form])

  const mutation = useMutation({
    mutationFn: (data: ApplicationRequest) => applicationsApi.update(application.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application', String(application.id)] })
      setOpen(false)
    },
  })

  const onSubmit = (data: any) => {
    const salaryMin = data.salaryMin?.trim()
    const salaryMax = data.salaryMax?.trim()

    const payload: ApplicationRequest = {
      companyName: data.companyName,
      positionTitle: data.positionTitle,
      location: data.location || undefined,
      workMode: data.workMode || undefined,
      applicationSource: data.applicationSource || undefined,
      jobPostingUrl: data.jobPostingUrl || undefined,
      salaryMin: salaryMin !== '' && salaryMin !== undefined ? Number(salaryMin) : undefined,
      salaryMax: salaryMax !== '' && salaryMax !== undefined ? Number(salaryMax) : undefined,
      status: data.status,
      applicationDate: data.applicationDate,
      nextStepDate: data.nextStepDate || undefined,
    }
    mutation.mutate(payload)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                {...form.register('companyName')}
                placeholder="e.g., Google"
              />
              {form.formState.errors.companyName && (
                <p className="text-sm text-red-500">{form.formState.errors.companyName.message}</p>
              )}
            </div>

            {/* Position Title */}
            <div className="space-y-2">
              <Label htmlFor="positionTitle">Position Title *</Label>
              <Input
                id="positionTitle"
                {...form.register('positionTitle')}
                placeholder="e.g., Software Engineer"
              />
              {form.formState.errors.positionTitle && (
                <p className="text-sm text-red-500">{form.formState.errors.positionTitle.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...form.register('location')}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            {/* Work Mode */}
            <div className="space-y-2">
              <Label htmlFor="workMode">Work Mode</Label>
              <Select
                value={form.watch('workMode') ?? ''}
                onValueChange={(value) => form.setValue('workMode', value as WorkMode)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REMOTE">Remote</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                  <SelectItem value="ONSITE">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Application Source */}
            <div className="space-y-2">
              <Label htmlFor="applicationSource">Application Source</Label>
              <Input
                id="applicationSource"
                {...form.register('applicationSource')}
                placeholder="e.g., LinkedIn"
              />
            </div>

            {/* Job Posting URL */}
            <div className="space-y-2">
              <Label htmlFor="jobPostingUrl">Job Posting URL</Label>
              <Input
                id="jobPostingUrl"
                {...form.register('jobPostingUrl')}
                placeholder="https://..."
              />
              {form.formState.errors.jobPostingUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.jobPostingUrl.message}</p>
              )}
            </div>

            {/* Salary Min */}
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input
                id="salaryMin"
                type="text"
                inputMode="numeric"
                {...form.register('salaryMin')}
                placeholder="e.g., 1000"
              />
              {form.formState.errors.salaryMin && (
                <p className="text-sm text-red-500">{form.formState.errors.salaryMin.message}</p>
              )}
            </div>

            {/* Salary Max */}
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input
                id="salaryMax"
                type="text"
                inputMode="numeric"
                {...form.register('salaryMax')}
                placeholder="e.g., 1500"
              />
              {form.formState.errors.salaryMax && (
                <p className="text-sm text-red-500">{form.formState.errors.salaryMax.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as ApplicationStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                  <SelectItem value="OFFER">Offer</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Application Date */}
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Application Date *</Label>
              <Input
                id="applicationDate"
                type="date"
                {...form.register('applicationDate')}
              />
              {form.formState.errors.applicationDate && (
                <p className="text-sm text-red-500">{form.formState.errors.applicationDate.message}</p>
              )}
            </div>

            {/* Next Step Date */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nextStepDate">Next Step Date</Label>
              <Input
                id="nextStepDate"
                type="date"
                {...form.register('nextStepDate')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-500">
              Failed to update application. Please try again.
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}