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
