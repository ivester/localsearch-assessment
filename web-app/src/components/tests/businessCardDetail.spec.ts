import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import BusinessCardDetail from '../BusinessCardDetail.vue'

const vuetify = createVuetify({
  components,
  directives,
})

const business = {
  id: 'id',
  name: 'business name',
  where: 'address'
}

global.ResizeObserver = require('resize-observer-polyfill')

describe('BusinessCardDetail', () => {
  test('shows with minimal information', () => {
    const wrapper = mount(BusinessCardDetail, {
      props: {
        business
      },
      global: {plugins: [vuetify]}
    })
  
    expect(wrapper.html()).toMatchSnapshot()
  })
  
  test('shows with maximum information (without opening hours)', () => {
    const wrapper = mount(BusinessCardDetail, {
      props: {
        business: {
          ...business,
          url: 'url',
          urlFormatted: 'url formatted',
          phone: 'phone',
          phoneFormatted: 'phone formatted',
          openingHours: [],
        }
      },
      global: {plugins: [vuetify]}
    })
  
    expect(wrapper.html()).toMatchSnapshot()
  })
})
