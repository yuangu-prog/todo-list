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
