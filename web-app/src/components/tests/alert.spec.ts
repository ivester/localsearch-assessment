import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import Alert from '../Alert.vue'

const vuetify = createVuetify({
  components,
  directives,
})

const router = createRouter({
  history: createWebHistory(),
  routes,
})

global.ResizeObserver = require('resize-observer-polyfill')

test('shows alert', () => {
  const wrapper = mount(Alert, {
    props: { message: 'error message'},
    global: {plugins: [vuetify, router]}
  })

  expect(wrapper.html()).toMatchSnapshot()
})
