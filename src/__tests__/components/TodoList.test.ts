import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import TodoList from '../../components/TodoList.vue'

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
