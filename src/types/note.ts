export interface Note {
  id: string
  title: string
  content: string // Markdown string
  tags: string[]
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export interface NoteFilterOptions {
  search: string
  selectedTag: string | 'all'
  pinnedOnly: boolean
}
