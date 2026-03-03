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
