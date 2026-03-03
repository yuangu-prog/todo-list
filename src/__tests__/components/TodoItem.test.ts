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
