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
