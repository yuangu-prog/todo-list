export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: string
  title: string
  completed: boolean
  priority: Priority
  categoryId: string
  dueDate: string | null
  order: number
  createdAt: string
}

export interface Category {
  id: string
  name: string
  color: string
  order: number
}

export type StatusFilter = 'all' | 'active' | 'completed'
export type PriorityFilter = 'all' | Priority
export type DueDateFilter = 'all' | 'today' | 'week' | 'overdue'

export interface Filters {
  status: StatusFilter
  priority: PriorityFilter
  dueDate: DueDateFilter
}

export const ALL_CATEGORY_ID = '__all__'

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '工作', color: '#409EFF', order: 0 },
  { id: 'life', name: '生活', color: '#67C23A', order: 1 },
  { id: 'study', name: '学习', color: '#E6A23C', order: 2 },
]

export const PRIORITY_CONFIG = {
  high: { label: '高', color: '#F56C6C' },
  medium: { label: '中', color: '#E6A23C' },
  low: { label: '低', color: '#67C23A' },
} as const
