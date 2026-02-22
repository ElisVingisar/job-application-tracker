import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notesApi } from '@/api/notes'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
import type { NoteResponse } from '@/types/note'

interface NotesSectionProps {
  applicationId: number
}

export default function NotesSection({ applicationId }: NotesSectionProps) {
  const queryClient = useQueryClient()
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editingNote, setEditingNote] = useState<NoteResponse | null>(null)
  const [editContent, setEditContent] = useState('')
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null)

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', applicationId],
    queryFn: () => notesApi.getByApplicationId(applicationId),
  })

  const createMutation = useMutation({
    mutationFn: (content: string) => notesApi.create(applicationId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', applicationId] })
      setNewNoteContent('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ noteId, content }: { noteId: number; content: string }) =>
      notesApi.update(applicationId, noteId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', applicationId] })
      setEditingNote(null)
      setEditContent('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (noteId: number) => notesApi.delete(applicationId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', applicationId] })
      setDeleteNoteId(null)
    },
  })

  const handleCreateNote = () => {
    if (newNoteContent.trim()) {
      createMutation.mutate(newNoteContent)
    }
  }

  const handleStartEdit = (note: NoteResponse) => {
    setEditingNote(note)
    setEditContent(note.content)
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditContent('')
  }

  const handleSaveEdit = () => {
    if (editingNote && editContent.trim()) {
      updateMutation.mutate({ noteId: editingNote.id, content: editContent })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-4">Notes</h3>
        <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-sm">Loading notes...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Notes</h3>
        {!newNoteContent && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewNoteContent(' ')}
          >
            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {newNoteContent && (
        <div className="mb-6">
          <Textarea
            placeholder="Write your note here..."
            value={newNoteContent.trim() ? newNoteContent : ''}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="mb-3 min-h-[100px] resize-none"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewNoteContent('')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNote}
              disabled={!newNoteContent.trim() || createMutation.isPending}
              size="sm"
            >
              {createMutation.isPending ? 'Adding...' : 'Save Note'}
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes && notes.length === 0 ? (
        <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-sm">
          No notes yet. Add one above to get started!
        </div>
      ) : (
        <div className="space-y-4">
          {notes
            ?.slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((note) => (
            <div
              key={note.id}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
            >
              {editingNote?.id === note.id ? (
                // Edit Mode
                <div>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mb-2 min-h-[100px] resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={!editContent.trim() || updateMutation.isPending}
                    >
                      {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap mb-3">{note.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {formatDate(note.createdAt)}
                      {new Date(note.updatedAt).getTime() - new Date(note.createdAt).getTime() > 1000 && ' (edited)'}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(note)}
                        className="h-7 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteNoteId(note.id)}
                        className="h-7 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteNoteId !== null} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteNoteId && deleteMutation.mutate(deleteNoteId)}
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
