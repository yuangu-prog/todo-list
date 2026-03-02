import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import TodoDialog from '../../components/TodoDialog.vue'

describe('TodoDialog', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  function mountDialog(props = {}) {
    wrapper = mount(TodoDialog, {
      props: {
        modelValue: true,
        ...props,
      },
      global: {
        plugins: [createPinia(), ElementPlus],
      },
      attachTo: document.body,
    })
    return wrapper
  }

  it('renders in create mode by default', () => {
    const wrapper = mountDialog()
    expect(wrapper.html()).toContain('新建任务')
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
    expect(wrapper.html()).toContain('编辑任务')
  })
})
