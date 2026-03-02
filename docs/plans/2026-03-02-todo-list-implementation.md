# Todo List 应用实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个基于 Vue 3 + Element Plus 的个人待办事项管理应用，支持分类、筛选、优先级、截止日期和拖拽排序。

**Architecture:** 单页面应用，左侧分类导航栏 + 右侧任务列表。使用 Pinia 管理状态，localStorage 持久化数据。所有组件通过 store 通信，不使用路由。

**Tech Stack:** Vue 3, TypeScript, Vite, Element Plus, Pinia, vuedraggable, Vitest, Vue Test Utils

**Design Doc:** `docs/plans/2026-03-02-todo-list-design.md`

---

### Task 1: 项目脚手架搭建

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Create: `src/main.ts`, `src/App.vue`, `src/vite-env.d.ts`

**Step 1: 用 Vite 初始化 Vue 3 + TypeScript 项目**

Run:
```bash
cd /d/02-prog/claude-tmp/todo-list
npm create vite@latest . -- --template vue-ts
```

如果提示目录非空，选择忽略已有文件继续。

**Step 2: 安装基础依赖**

Run:
```bash
npm install
```

**Step 3: 验证项目能启动**

Run:
```bash
npm run dev
```
Expected: 看到 Vite 开发服务器启动，访问 localhost 能看到 Vue 默认页面。停止服务器后继续。

**Step 4: 提交**

```bash
git add -A
git commit -m "feat: scaffold Vue 3 + TypeScript project with Vite"
```

---

### Task 2: 安装项目依赖

**Files:**
- Modify: `package.json`

**Step 1: 安装运行时依赖**

```bash
npm install element-plus pinia vuedraggable@next @element-plus/icons-vue
```

**Step 2: 安装开发依赖（测试相关）**

```bash
npm install -D vitest @vue/test-utils happy-dom @vitejs/plugin-vue
```

**Step 3: 配置 Vitest**

修改 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

修改 `tsconfig.json` 的 `compilerOptions` 添加：
```json
"types": ["vitest/globals"]
```

修改 `package.json` 的 scripts 添加：
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: 配置 Element Plus**

修改 `src/main.ts`：

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')
```

**Step 5: 验证测试框架工作**

创建 `src/__tests__/setup.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'

describe('test setup', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `npm test`
Expected: 1 test passed

**Step 6: 提交**

```bash
git add -A
git commit -m "feat: add Element Plus, Pinia, vuedraggable, and Vitest"
```

---

### Task 3: 类型定义

**Files:**
- Create: `src/types/todo.ts`
- Test: `src/__tests__/types.test.ts`

**Step 1: 编写类型定义**

创建 `src/types/todo.ts`：

```typescript
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
```

**Step 2: 编写类型测试**

创建 `src/__tests__/types.test.ts`：

```typescript
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
```

**Step 3: 运行测试**

Run: `npm test`
Expected: All tests pass

**Step 4: 提交**

```bash
git add src/types/todo.ts src/__tests__/types.test.ts
git commit -m "feat: add TypeScript type definitions for Todo and Category"
```

---

### Task 4: Pinia Store（核心逻辑）

**Files:**
- Create: `src/stores/todo.ts`
- Test: `src/__tests__/stores/todo.test.ts`

**Step 1: 编写 store 测试**

创建 `src/__tests__/stores/todo.test.ts`：

```typescript
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
```

**Step 2: 运行测试确认失败**

Run: `npm test`
Expected: FAIL - module not found

**Step 3: 实现 store**

创建 `src/stores/todo.ts`：

```typescript
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
```

**Step 4: 运行测试确认通过**

Run: `npm test`
Expected: All tests pass

**Step 5: 提交**

```bash
git add src/stores/todo.ts src/__tests__/stores/todo.test.ts
git commit -m "feat: implement Pinia todo store with localStorage persistence"
```

---

### Task 5: Sidebar 侧边栏组件

**Files:**
- Create: `src/components/Sidebar.vue`
- Test: `src/__tests__/components/Sidebar.test.ts`

**Step 1: 编写 Sidebar 测试**

创建 `src/__tests__/components/Sidebar.test.ts`：

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import Sidebar from '../../components/Sidebar.vue'

describe('Sidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  function mountSidebar() {
    return mount(Sidebar, {
      global: {
        plugins: [createPinia(), ElementPlus],
      },
    })
  }

  it('renders "全部" and default categories', () => {
    const wrapper = mountSidebar()
    const text = wrapper.text()
    expect(text).toContain('全部')
    expect(text).toContain('工作')
    expect(text).toContain('生活')
    expect(text).toContain('学习')
  })

  it('highlights selected category', async () => {
    const wrapper = mountSidebar()
    const items = wrapper.findAll('.sidebar-item')
    // "全部" should be active by default
    expect(items[0].classes()).toContain('is-active')
  })
})
```

**Step 2: 运行测试确认失败**

Run: `npm test`
Expected: FAIL

**Step 3: 实现 Sidebar 组件**

创建 `src/components/Sidebar.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useTodoStore } from '../stores/todo'
import { ALL_CATEGORY_ID } from '../types/todo'

const store = useTodoStore()

const showAddDialog = ref(false)
const newCategoryName = ref('')
const newCategoryColor = ref('#409EFF')

const editingCategory = ref<string | null>(null)
const editName = ref('')
const editColor = ref('')

function selectCategory(id: string) {
  store.selectedCategoryId = id
}

function handleAddCategory() {
  if (!newCategoryName.value.trim()) return
  store.addCategory(newCategoryName.value.trim(), newCategoryColor.value)
  newCategoryName.value = ''
  newCategoryColor.value = '#409EFF'
  showAddDialog.value = false
}

function startEdit(id: string, name: string, color: string) {
  editingCategory.value = id
  editName.value = name
  editColor.value = color
}

function saveEdit() {
  if (editingCategory.value && editName.value.trim()) {
    store.updateCategory(editingCategory.value, {
      name: editName.value.trim(),
      color: editColor.value,
    })
  }
  editingCategory.value = null
}

function handleDelete(id: string) {
  ElMessageBox.confirm('删除分类将同时删除该分类下的所有任务，确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.deleteCategory(id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleContextMenu(e: MouseEvent, id: string, name: string, color: string) {
  e.preventDefault()
  startEdit(id, name, color)
}
</script>

<template>
  <div class="sidebar">
    <h2 class="sidebar-title">分类</h2>

    <div
      class="sidebar-item"
      :class="{ 'is-active': store.selectedCategoryId === ALL_CATEGORY_ID }"
      @click="selectCategory(ALL_CATEGORY_ID)"
    >
      <span>全部</span>
      <el-badge :value="store.categoryTodoCounts[ALL_CATEGORY_ID] || 0" type="info" />
    </div>

    <div
      v-for="cat in store.categories"
      :key="cat.id"
      class="sidebar-item"
      :class="{ 'is-active': store.selectedCategoryId === cat.id }"
      @click="selectCategory(cat.id)"
      @contextmenu="handleContextMenu($event, cat.id, cat.name, cat.color)"
    >
      <template v-if="editingCategory === cat.id">
        <el-input
          v-model="editName"
          size="small"
          style="width: 80px"
          @keyup.enter="saveEdit"
          @blur="saveEdit"
        />
        <el-color-picker v-model="editColor" size="small" />
        <el-button size="small" type="danger" @click.stop="handleDelete(cat.id)">删除</el-button>
      </template>
      <template v-else>
        <span class="category-dot" :style="{ backgroundColor: cat.color }" />
        <span>{{ cat.name }}</span>
        <el-badge :value="store.categoryTodoCounts[cat.id] || 0" type="info" />
      </template>
    </div>

    <div class="sidebar-item add-category" @click="showAddDialog = true">
      <el-icon><Plus /></el-icon>
      <span>新分类</span>
    </div>

    <el-dialog v-model="showAddDialog" title="新建分类" width="360px">
      <el-form @submit.prevent="handleAddCategory">
        <el-form-item label="名称">
          <el-input v-model="newCategoryName" placeholder="输入分类名称" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="newCategoryColor" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddCategory">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  border-right: 1px solid var(--el-border-color-light);
  padding: 16px 0;
  overflow-y: auto;
}

.sidebar-title {
  padding: 0 16px 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: var(--el-fill-color-light);
}

.sidebar-item.is-active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.add-category {
  color: var(--el-text-color-secondary);
  margin-top: 8px;
  border-top: 1px solid var(--el-border-color-lighter);
  padding-top: 16px;
}
</style>
```

**Step 4: 运行测试确认通过**

Run: `npm test`
Expected: All tests pass

**Step 5: 提交**

```bash
git add src/components/Sidebar.vue src/__tests__/components/Sidebar.test.ts
git commit -m "feat: implement Sidebar component with category management"
```

---

### Task 6: TodoDialog 任务弹窗组件

**Files:**
- Create: `src/components/TodoDialog.vue`
- Test: `src/__tests__/components/TodoDialog.test.ts`

**Step 1: 编写 TodoDialog 测试**

创建 `src/__tests__/components/TodoDialog.test.ts`：

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import TodoDialog from '../../components/TodoDialog.vue'

describe('TodoDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  function mountDialog(props = {}) {
    return mount(TodoDialog, {
      props: {
        modelValue: true,
        ...props,
      },
      global: {
        plugins: [createPinia(), ElementPlus],
      },
    })
  }

  it('renders in create mode by default', () => {
    const wrapper = mountDialog()
    expect(wrapper.text()).toContain('新建任务')
  })

  it('renders in edit mode when todo prop is provided', () => {
    const wrapper = mountDialog({
      todo: {
        id: '1',
        title: '测试任务',
        completed: false,
        priority: 'high',
        categoryId: 'work',
        dueDate: null,
        order: 0,
        createdAt: new Date().toISOString(),
      },
    })
    expect(wrapper.text()).toContain('编辑任务')
  })
})
```

**Step 2: 运行测试确认失败**

Run: `npm test`
Expected: FAIL

**Step 3: 实现 TodoDialog 组件**

创建 `src/components/TodoDialog.vue`：

```vue
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useTodoStore } from '../stores/todo'
import { PRIORITY_CONFIG } from '../types/todo'
import type { Todo, Priority } from '../types/todo'

const props = defineProps<{
  modelValue: boolean
  todo?: Todo | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const store = useTodoStore()

const form = ref({
  title: '',
  priority: 'medium' as Priority,
  categoryId: '',
  dueDate: null as string | null,
})

const isEdit = computed(() => !!props.todo)
const dialogTitle = computed(() => isEdit.value ? '编辑任务' : '新建任务')

watch(() => props.modelValue, (visible) => {
  if (visible) {
    if (props.todo) {
      form.value = {
        title: props.todo.title,
        priority: props.todo.priority,
        categoryId: props.todo.categoryId,
        dueDate: props.todo.dueDate,
      }
    } else {
      form.value = {
        title: '',
        priority: 'medium',
        categoryId: store.categories[0]?.id || '',
        dueDate: null,
      }
    }
  }
})

function handleSubmit() {
  if (!form.value.title.trim()) return

  if (isEdit.value && props.todo) {
    store.updateTodo(props.todo.id, {
      title: form.value.title.trim(),
      priority: form.value.priority,
      categoryId: form.value.categoryId,
      dueDate: form.value.dueDate,
    })
  } else {
    store.addTodo({
      title: form.value.title.trim(),
      priority: form.value.priority,
      categoryId: form.value.categoryId,
      dueDate: form.value.dueDate,
    })
  }

  emit('update:modelValue', false)
}

function handleClose() {
  emit('update:modelValue', false)
}

const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
  color: config.color,
}))
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="dialogTitle"
    width="480px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form :model="form" label-width="80px" @submit.prevent="handleSubmit">
      <el-form-item label="标题">
        <el-input
          v-model="form.title"
          placeholder="输入任务标题"
          autofocus
        />
      </el-form-item>

      <el-form-item label="分类">
        <el-select v-model="form.categoryId" placeholder="选择分类" style="width: 100%">
          <el-option
            v-for="cat in store.categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="优先级">
        <el-radio-group v-model="form.priority">
          <el-radio-button
            v-for="opt in priorityOptions"
            :key="opt.value"
            :value="opt.value"
          >
            <span :style="{ color: opt.color }">{{ opt.label }}</span>
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="截止日期">
        <el-date-picker
          v-model="form.dueDate"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ isEdit ? '保存' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>
```

**Step 4: 运行测试确认通过**

Run: `npm test`
Expected: All tests pass

**Step 5: 提交**

```bash
git add src/components/TodoDialog.vue src/__tests__/components/TodoDialog.test.ts
git commit -m "feat: implement TodoDialog component for create/edit tasks"
```

---

### Task 7: TodoItem 任务项组件

**Files:**
- Create: `src/components/TodoItem.vue`
- Test: `src/__tests__/components/TodoItem.test.ts`

**Step 1: 编写 TodoItem 测试**

创建 `src/__tests__/components/TodoItem.test.ts`：

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import TodoItem from '../../components/TodoItem.vue'
import type { Todo } from '../../types/todo'

describe('TodoItem', () => {
  const todo: Todo = {
    id: '1',
    title: '买菜',
    completed: false,
    priority: 'high',
    categoryId: 'work',
    dueDate: '2026-03-05',
    order: 0,
    createdAt: '2026-03-02T00:00:00.000Z',
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  function mountItem(props = {}) {
    return mount(TodoItem, {
      props: { todo, ...props },
      global: {
        plugins: [createPinia(), ElementPlus],
      },
    })
  }

  it('renders todo title', () => {
    const wrapper = mountItem()
    expect(wrapper.text()).toContain('买菜')
  })

  it('shows priority indicator', () => {
    const wrapper = mountItem()
    expect(wrapper.find('.priority-dot').exists()).toBe(true)
  })

  it('emits edit event on click', async () => {
    const wrapper = mountItem()
    await wrapper.find('.todo-content').trigger('click')
    expect(wrapper.emitted('edit')).toBeTruthy()
  })
})
```

**Step 2: 运行测试确认失败**

Run: `npm test`
Expected: FAIL

**Step 3: 实现 TodoItem 组件**

创建 `src/components/TodoItem.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useTodoStore } from '../stores/todo'
import { PRIORITY_CONFIG } from '../types/todo'
import type { Todo } from '../types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  edit: [todo: Todo]
}>()

const store = useTodoStore()

const priorityColor = computed(() => PRIORITY_CONFIG[props.todo.priority].color)

const dueDateText = computed(() => {
  if (!props.todo.dueDate) return ''
  const date = new Date(props.todo.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return '已过期'
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  return props.todo.dueDate
})

const isOverdue = computed(() => {
  if (!props.todo.dueDate || props.todo.completed) return false
  const date = new Date(props.todo.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
})

function handleToggle() {
  store.toggleTodo(props.todo.id)
}

function handleDelete() {
  ElMessageBox.confirm('确定删除这个任务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    store.deleteTodo(props.todo.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleEdit() {
  emit('edit', props.todo)
}
</script>

<template>
  <div class="todo-item" :class="{ 'is-completed': todo.completed }">
    <el-checkbox
      :model-value="todo.completed"
      @change="handleToggle"
    />

    <span class="priority-dot" :style="{ backgroundColor: priorityColor }" />

    <div class="todo-content" @click="handleEdit">
      <span class="todo-title">{{ todo.title }}</span>
      <span
        v-if="dueDateText"
        class="todo-due"
        :class="{ 'is-overdue': isOverdue }"
      >
        {{ dueDateText }}
      </span>
    </div>

    <el-button
      class="delete-btn"
      :icon="Delete"
      circle
      size="small"
      type="danger"
      plain
      @click.stop="handleDelete"
    />
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s;
}

.todo-item:hover {
  background-color: var(--el-fill-color-lighter);
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

.todo-item.is-completed .todo-title {
  text-decoration: line-through;
  color: var(--el-text-color-placeholder);
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.todo-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-width: 0;
}

.todo-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-due {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  flex-shrink: 0;
  margin-left: 12px;
}

.todo-due.is-overdue {
  color: var(--el-color-danger);
  font-weight: 500;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
}
</style>
```

**Step 4: 运行测试确认通过**

Run: `npm test`
Expected: All tests pass

**Step 5: 提交**

```bash
git add src/components/TodoItem.vue src/__tests__/components/TodoItem.test.ts
git commit -m "feat: implement TodoItem component with priority and due date display"
```

---

### Task 8: TodoList 任务列表组件

**Files:**
- Create: `src/components/TodoList.vue`
- Test: `src/__tests__/components/TodoList.test.ts`

**Step 1: 编写 TodoList 测试**

创建 `src/__tests__/components/TodoList.test.ts`：

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import TodoList from '../../components/TodoList.vue'
import { useTodoStore } from '../../stores/todo'

describe('TodoList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  function mountList() {
    const pinia = createPinia()
    return mount(TodoList, {
      global: {
        plugins: [pinia, ElementPlus],
      },
    })
  }

  it('shows empty state when no todos', () => {
    const wrapper = mountList()
    expect(wrapper.text()).toContain('暂无任务')
  })

  it('shows filter bar', () => {
    const wrapper = mountList()
    expect(wrapper.find('.filter-bar').exists()).toBe(true)
  })

  it('shows add button', () => {
    const wrapper = mountList()
    expect(wrapper.text()).toContain('新建')
  })
})
```

**Step 2: 运行测试确认失败**

Run: `npm test`
Expected: FAIL

**Step 3: 实现 TodoList 组件**

创建 `src/components/TodoList.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useTodoStore } from '../stores/todo'
import TodoItem from './TodoItem.vue'
import TodoDialog from './TodoDialog.vue'
import type { Todo } from '../types/todo'

const store = useTodoStore()

const showDialog = ref(false)
const editingTodo = ref<Todo | null>(null)

function handleAdd() {
  editingTodo.value = null
  showDialog.value = true
}

function handleEdit(todo: Todo) {
  editingTodo.value = todo
  showDialog.value = true
}

function handleDragEnd() {
  const orderedIds = store.filteredTodos.map(t => t.id)
  store.reorderTodos(orderedIds)
}

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'active' },
  { label: '已完成', value: 'completed' },
]

const priorityOptions = [
  { label: '全部优先级', value: 'all' },
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' },
]

const dueDateOptions = [
  { label: '全部日期', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '已过期', value: 'overdue' },
]
</script>

<template>
  <div class="todo-list">
    <div class="filter-bar">
      <div class="filters">
        <el-select v-model="store.filters.status" size="default" style="width: 100px">
          <el-option
            v-for="opt in statusOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="store.filters.priority" size="default" style="width: 120px">
          <el-option
            v-for="opt in priorityOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>

        <el-select v-model="store.filters.dueDate" size="default" style="width: 120px">
          <el-option
            v-for="opt in dueDateOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>

      <el-button type="primary" :icon="Plus" @click="handleAdd">
        新建
      </el-button>
    </div>

    <div class="todo-items">
      <draggable
        :model-value="store.filteredTodos"
        item-key="id"
        handle=".todo-item"
        ghost-class="drag-ghost"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <TodoItem :todo="element" @edit="handleEdit" />
        </template>
      </draggable>

      <div v-if="store.filteredTodos.length === 0" class="empty-state">
        <el-empty description="暂无任务" />
      </div>
    </div>

    <TodoDialog
      v-model="showDialog"
      :todo="editingTodo"
    />
  </div>
</template>

<style scoped>
.todo-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.filters {
  display: flex;
  gap: 10px;
}

.todo-items {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 80px;
}

.drag-ghost {
  opacity: 0.5;
  background: var(--el-color-primary-light-9);
}
</style>
```

**Step 4: 运行测试确认通过**

Run: `npm test`
Expected: All tests pass

**Step 5: 提交**

```bash
git add src/components/TodoList.vue src/__tests__/components/TodoList.test.ts
git commit -m "feat: implement TodoList component with filtering and drag-and-drop"
```

---

### Task 9: App.vue 主布局

**Files:**
- Modify: `src/App.vue`

**Step 1: 实现 App.vue 主布局**

替换 `src/App.vue` 内容：

```vue
<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TodoList from './components/TodoList.vue'
</script>

<template>
  <div class="app-container">
    <Sidebar />
    <TodoList />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
</style>
```

**Step 2: 清理 Vite 默认文件**

删除 Vite 脚手架生成的默认文件（如果存在）：
- `src/components/HelloWorld.vue`
- `src/style.css`
- `src/assets/vue.svg`
- `public/vite.svg`

检查 `src/main.ts` 不要引入已删除的 `style.css`。

**Step 3: 验证应用能启动**

Run:
```bash
npm run dev
```
Expected: 应用启动，能看到左侧分类栏 + 右侧任务列表的布局。

**Step 4: 运行全部测试**

Run: `npm test`
Expected: All tests pass

**Step 5: 提交**

```bash
git add -A
git commit -m "feat: implement App layout and wire up all components"
```

---

### Task 10: 最终验收与清理

**Step 1: 运行全部测试**

Run: `npm test`
Expected: All tests pass

**Step 2: TypeScript 类型检查**

Run: `npx vue-tsc --noEmit`
Expected: No errors

**Step 3: 构建验证**

Run: `npm run build`
Expected: Build succeeds

**Step 4: 手动功能验证**

启动 `npm run dev`，逐项验证：
- [ ] 能添加任务（标题、分类、优先级、截止日期）
- [ ] 能勾选完成/取消完成
- [ ] 能编辑任务
- [ ] 能删除任务（有二次确认）
- [ ] 能拖拽排序
- [ ] 分类筛选正常
- [ ] 状态/优先级/日期筛选正常
- [ ] 能添加/编辑/删除分类
- [ ] 刷新页面数据仍在（localStorage 持久化）

**Step 5: 更新 CLAUDE.md**

更新 `CLAUDE.md` 中的项目描述，添加常用命令。

**Step 6: 最终提交**

```bash
git add -A
git commit -m "chore: final cleanup and update project docs"
```
