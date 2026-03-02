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
