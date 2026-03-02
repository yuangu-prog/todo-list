# Todo List 应用设计文档

## 概述

个人日常任务管理应用，单页面布局，支持分类、筛选、优先级、截止日期和拖拽排序。

## 技术栈

- **框架：** Vue 3 + TypeScript + Vite
- **UI 库：** Element Plus
- **状态管理：** Pinia
- **拖拽：** vuedraggable（基于 Sortable.js）
- **数据持久化：** localStorage（通过 Pinia 插件自动同步）

## 项目结构

```
src/
├── App.vue              # 主布局：侧边栏 + 内容区
├── main.ts              # 入口文件
├── components/
│   ├── Sidebar.vue      # 左侧分类导航
│   ├── TodoList.vue     # 任务列表（含筛选/排序）
│   ├── TodoItem.vue     # 单个任务项（勾选、拖拽、内联编辑）
│   └── TodoDialog.vue   # 创建/编辑任务弹窗
├── stores/
│   └── todo.ts          # Pinia store（任务 + 分类的所有状态）
└── types/
    └── todo.ts          # TypeScript 类型定义
```

## 数据模型

```typescript
interface Todo {
  id: string            // UUID
  title: string         // 任务标题
  completed: boolean    // 是否完成
  priority: 'high' | 'medium' | 'low'
  categoryId: string    // 所属分类 ID
  dueDate: string | null  // 截止日期 (ISO string)
  order: number         // 排序序号（拖拽排序用）
  createdAt: string     // 创建时间
}

interface Category {
  id: string
  name: string          // 分类名称
  color: string         // 显示颜色
  order: number         // 排序序号
}
```

## UI 布局

```
┌──────────┬─────────────────────────────────┐
│  侧边栏   │          内容区                  │
│          │  ┌─────────────────────────────┐ │
│  全部 (5) │  │ 筛选栏: [状态▾] [优先级▾]    │ │
│  工作 (2) │  │         [截止日期▾]  [+新建]  │ │
│  生活 (3) │  ├─────────────────────────────┤ │
│          │  │ ☐ 🔴 买菜       明天到期     │ │
│  + 新分类  │  │ ☐ 🟡 写报告     本周五       │ │
│          │  │ ☑ 🟢 读书30分钟  已完成       │ │
│          │  │ ...  (可拖拽排序)             │ │
│          │  └─────────────────────────────┘ │
└──────────┴─────────────────────────────────┘
```

## 核心交互

- **添加任务：** 点击 "+新建" 按钮打开 Dialog，填写标题、分类、优先级、截止日期
- **编辑任务：** 点击任务项打开编辑 Dialog
- **完成任务：** 点击 Checkbox 切换状态，已完成任务显示删除线
- **删除任务：** 鼠标悬停显示删除图标，点击后二次确认
- **拖拽排序：** 拖拽任务项上下移动调整顺序
- **分类管理：** 侧边栏添加分类，右键编辑/删除分类

## 筛选

- **按状态：** 全部 / 未完成 / 已完成
- **按优先级：** 高 / 中 / 低
- **按截止日期：** 今天 / 本周 / 已过期

## 优先级标识

- 红色（高）、黄色（中）、绿色（低），用色彩标记显示在任务标题前

## 数据持久化

使用 Pinia 插件监听 store 变化，自动同步到 localStorage。页面加载时从 localStorage 恢复数据。
