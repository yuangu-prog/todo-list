import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Todo, Category, Filters, Priority } from '../types/todo'
import { ALL_CATEGORY_ID, DEFAULT_CATEGORIES } from '../types/todo'

const STORAGE_KEY = 'todo-app-data'

function generateId(): string {
  return crypto.randomUUID()
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function isThisWeek(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  return date >= weekStart && date < weekEnd
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const categories = ref<Category[]>([...DEFAULT_CATEGORIES])
  const selectedCategoryId = ref<string>(ALL_CATEGORY_ID)
  const filters = ref<Filters>({
    status: 'all',
    priority: 'all',
    dueDate: 'all',
  })

  const filteredTodos = computed(() => {
    let result = [...todos.value]

    // Filter by category
    if (selectedCategoryId.value !== ALL_CATEGORY_ID) {
      result = result.filter(t => t.categoryId === selectedCategoryId.value)
    }

    // Filter by status
    if (filters.value.status === 'active') {
      result = result.filter(t => !t.completed)
    } else if (filters.value.status === 'completed') {
      result = result.filter(t => t.completed)
    }

    // Filter by priority
    if (filters.value.priority !== 'all') {
      result = result.filter(t => t.priority === filters.value.priority)
    }

    // Filter by due date
    if (filters.value.dueDate !== 'all') {
      result = result.filter(t => {
        if (!t.dueDate) return false
        switch (filters.value.dueDate) {
          case 'today': return isToday(t.dueDate)
          case 'week': return isThisWeek(t.dueDate)
          case 'overdue': return isOverdue(t.dueDate) && !t.completed
          default: return true
        }
      })
    }

    return result.sort((a, b) => a.order - b.order)
  })

  const categoryTodoCounts = computed(() => {
    const counts: Record<string, number> = {}
    for (const cat of categories.value) {
      counts[cat.id] = todos.value.filter(t => t.categoryId === cat.id).length
    }
    counts[ALL_CATEGORY_ID] = todos.value.length
    return counts
  })

  function addTodo(data: { title: string; priority: Priority; categoryId: string; dueDate: string | null }) {
    const todo: Todo = {
      id: generateId(),
      title: data.title,
      completed: false,
      priority: data.priority,
      categoryId: data.categoryId,
      dueDate: data.dueDate,
      order: todos.value.length,
      createdAt: new Date().toISOString(),
    }
    todos.value.push(todo)
  }

  function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  function updateTodo(id: string, data: Partial<Omit<Todo, 'id' | 'createdAt'>>) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) Object.assign(todo, data)
  }

  function deleteTodo(id: string) {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  function reorderTodos(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const todo = todos.value.find(t => t.id === id)
      if (todo) todo.order = index
    })
    todos.value.sort((a, b) => a.order - b.order)
  }

  function addCategory(name: string, color: string) {
    categories.value.push({
      id: generateId(),
      name,
      color,
      order: categories.value.length,
    })
  }

  function updateCategory(id: string, data: Partial<Omit<Category, 'id'>>) {
    const cat = categories.value.find(c => c.id === id)
    if (cat) Object.assign(cat, data)
  }

  function deleteCategory(id: string) {
    categories.value = categories.value.filter(c => c.id !== id)
    todos.value = todos.value.filter(t => t.categoryId !== id)
    if (selectedCategoryId.value === id) {
      selectedCategoryId.value = ALL_CATEGORY_ID
    }
  }

  function saveToLocalStorage() {
    const data = {
      todos: todos.value,
      categories: categories.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function loadFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.todos) todos.value = data.todos
      if (data.categories) categories.value = data.categories
    }
  }

  // Auto-persist on changes
  watch([todos, categories], () => {
    saveToLocalStorage()
  }, { deep: true })

  // Load on init
  loadFromLocalStorage()

  return {
    todos,
    categories,
    selectedCategoryId,
    filters,
    filteredTodos,
    categoryTodoCounts,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    addCategory,
    updateCategory,
    deleteCategory,
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})
