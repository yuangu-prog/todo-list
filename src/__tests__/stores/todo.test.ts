import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '../../stores/todo'

describe('useTodoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  describe('categories', () => {
    it('initializes with default categories', () => {
      const store = useTodoStore()
      expect(store.categories.length).toBe(3)
    })

    it('adds a category', () => {
      const store = useTodoStore()
      store.addCategory('购物', '#ff0000')
      expect(store.categories.length).toBe(4)
      expect(store.categories[3].name).toBe('购物')
    })

    it('updates a category', () => {
      const store = useTodoStore()
      const id = store.categories[0].id
      store.updateCategory(id, { name: '新名称' })
      expect(store.categories[0].name).toBe('新名称')
    })

    it('deletes a category and its todos', () => {
      const store = useTodoStore()
      const catId = store.categories[0].id
      store.addTodo({ title: 'test', priority: 'medium', categoryId: catId, dueDate: null })
      store.deleteCategory(catId)
      expect(store.categories.length).toBe(2)
      expect(store.todos.length).toBe(0)
    })
  })

  describe('todos', () => {
    it('starts with empty todos', () => {
      const store = useTodoStore()
      expect(store.todos).toEqual([])
    })

    it('adds a todo', () => {
      const store = useTodoStore()
      store.addTodo({ title: '买菜', priority: 'high', categoryId: 'work', dueDate: null })
      expect(store.todos.length).toBe(1)
      expect(store.todos[0].title).toBe('买菜')
      expect(store.todos[0].completed).toBe(false)
    })

    it('toggles todo completion', () => {
      const store = useTodoStore()
      store.addTodo({ title: '买菜', priority: 'high', categoryId: 'work', dueDate: null })
      const id = store.todos[0].id
      store.toggleTodo(id)
      expect(store.todos[0].completed).toBe(true)
      store.toggleTodo(id)
      expect(store.todos[0].completed).toBe(false)
    })

    it('updates a todo', () => {
      const store = useTodoStore()
      store.addTodo({ title: '买菜', priority: 'high', categoryId: 'work', dueDate: null })
      const id = store.todos[0].id
      store.updateTodo(id, { title: '买水果', priority: 'low' })
      expect(store.todos[0].title).toBe('买水果')
      expect(store.todos[0].priority).toBe('low')
    })

    it('deletes a todo', () => {
      const store = useTodoStore()
      store.addTodo({ title: '买菜', priority: 'high', categoryId: 'work', dueDate: null })
      const id = store.todos[0].id
      store.deleteTodo(id)
      expect(store.todos.length).toBe(0)
    })

    it('reorders todos', () => {
      const store = useTodoStore()
      store.addTodo({ title: 'A', priority: 'high', categoryId: 'work', dueDate: null })
      store.addTodo({ title: 'B', priority: 'medium', categoryId: 'work', dueDate: null })
      store.addTodo({ title: 'C', priority: 'low', categoryId: 'work', dueDate: null })
      const reordered = [store.todos[2], store.todos[0], store.todos[1]]
      store.reorderTodos(reordered.map(t => t.id))
      expect(store.todos[0].order).toBe(0)
      expect(store.todos[1].order).toBe(1)
      expect(store.todos[2].order).toBe(2)
    })
  })

  describe('filteredTodos', () => {
    it('filters by category', () => {
      const store = useTodoStore()
      store.addTodo({ title: 'A', priority: 'high', categoryId: 'work', dueDate: null })
      store.addTodo({ title: 'B', priority: 'medium', categoryId: 'life', dueDate: null })
      store.selectedCategoryId = 'work'
      expect(store.filteredTodos.length).toBe(1)
      expect(store.filteredTodos[0].title).toBe('A')
    })

    it('filters by status', () => {
      const store = useTodoStore()
      store.addTodo({ title: 'A', priority: 'high', categoryId: 'work', dueDate: null })
      store.addTodo({ title: 'B', priority: 'medium', categoryId: 'work', dueDate: null })
      store.toggleTodo(store.todos[0].id)
      store.filters.status = 'completed'
      expect(store.filteredTodos.length).toBe(1)
      expect(store.filteredTodos[0].title).toBe('A')
    })

    it('filters by priority', () => {
      const store = useTodoStore()
      store.addTodo({ title: 'A', priority: 'high', categoryId: 'work', dueDate: null })
      store.addTodo({ title: 'B', priority: 'low', categoryId: 'work', dueDate: null })
      store.filters.priority = 'high'
      expect(store.filteredTodos.length).toBe(1)
      expect(store.filteredTodos[0].title).toBe('A')
    })
  })

  describe('persistence', () => {
    it('saves and loads from localStorage', () => {
      const store = useTodoStore()
      store.addTodo({ title: '持久化测试', priority: 'high', categoryId: 'work', dueDate: null })
      store.saveToLocalStorage()

      // Create new store instance
      setActivePinia(createPinia())
      const store2 = useTodoStore()
      store2.loadFromLocalStorage()
      expect(store2.todos.length).toBe(1)
      expect(store2.todos[0].title).toBe('持久化测试')
    })
  })
})
