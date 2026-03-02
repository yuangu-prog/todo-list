import { describe, it, expect } from 'vitest'
import { ALL_CATEGORY_ID, DEFAULT_CATEGORIES, PRIORITY_CONFIG } from '../types/todo'
import type { Todo, Category, Filters } from '../types/todo'

describe('types/todo', () => {
  it('ALL_CATEGORY_ID is defined', () => {
    expect(ALL_CATEGORY_ID).toBe('__all__')
  })

  it('DEFAULT_CATEGORIES has 3 items', () => {
    expect(DEFAULT_CATEGORIES).toHaveLength(3)
    expect(DEFAULT_CATEGORIES.map(c => c.id)).toEqual(['work', 'life', 'study'])
  })

  it('PRIORITY_CONFIG has all priorities', () => {
    expect(PRIORITY_CONFIG.high.color).toBe('#F56C6C')
    expect(PRIORITY_CONFIG.medium.color).toBe('#E6A23C')
    expect(PRIORITY_CONFIG.low.color).toBe('#67C23A')
  })

  it('Todo interface can be constructed', () => {
    const todo: Todo = {
      id: '1',
      title: 'Test',
      completed: false,
      priority: 'medium',
      categoryId: 'work',
      dueDate: null,
      order: 0,
      createdAt: new Date().toISOString(),
    }
    expect(todo.title).toBe('Test')
  })
})
