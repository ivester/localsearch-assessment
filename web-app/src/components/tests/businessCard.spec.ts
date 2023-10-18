import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import HelloWorld from '../../src/components/HelloWorld.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router'
import BusinessCard from '../BusinessCard.vue'

const vuetify = createVuetify({
  components,
  directives,
})

const router = createRouter({
  history: createWebHistory(),
  routes
})

global.ResizeObserver = require('resize-observer-polyfill')

const business = {
  id: 'id',
  name: 'business name',
  where: 'address'
}

describe('BusinessCard', () => {
  test('shows search variant', () => {
    const wrapper = mount(BusinessCard, {
      props: {
        business,
        variant: 'search'
      },
      global: {plugins: [vuetify, router]}
    })
  
    expect(wrapper.html()).toMatchSnapshot()
  })
  
  test('shows detail variant', () => {
    const wrapper = mount(BusinessCard, {
      props: {
        business
      },
      global: {plugins: [vuetify, router]}
    })
  
    expect(wrapper.html()).toMatchSnapshot()
  })
})
