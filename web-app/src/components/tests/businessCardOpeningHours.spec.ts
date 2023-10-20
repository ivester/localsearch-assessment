import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import BusinessCardOpeningHours from '../BusinessCardOpeningHours.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

describe('BusinessCardOpeningHours', () => {
  test('shows no opening hours', () => {
    const wrapper = mount(BusinessCardOpeningHours, {
      props: {
        openingHours: []
      },
      global: {plugins: [vuetify]}
    })
  
    expect(wrapper.html()).toMatchSnapshot()
  })

  test(`
    shows the following opening hours:
    * Monday: Closed
    * Tuesday - Friday: 11:30 - 15:00, 18:30 - 00:00
    * Saturday: 18:00 - 00:00
    * Sunday: 11:30 - 15:00
  `, () => {
    const wrapper = mount(BusinessCardOpeningHours, {
      props: {
        openingHours: [
          {
            id: 0,
            day: 'monday',
            hours: []
          },
          {
            id: 1,
            day: 'tuesday',
            hours: [
              { start: '11:30', end: '15:00' },
              { start: '18:30', end: '00:00' }
            ]
          },
          {
            id: 2,
            day: 'wednesday',
            hours: [
              { start: '11:30', end: '15:00' },
              { start: '18:30', end: '00:00' }
            ]
          },
          {
            id: 3,
            day: 'thursday',
            hours: [
              { start: '11:30', end: '15:00' },
              { start: '18:30', end: '00:00' }
            ]
          },
          {
            id: 4,
            day: 'friday',
            hours: [
              { start: '11:30', end: '15:00' },
              { start: '18:30', end: '00:00' }
            ]
          },
          {
            id: 5,
            day: 'saturday',
            hours: [
              { start: '18:00', end: '00:00' }
            ]
          },
          {
            id: 6,
            day: 'sunday',
            hours: [
              { start: '11:30', end: '15:00' }
            ]
          }
        ],
      },
      global: {plugins: [vuetify]}
    })
  
    expect(wrapper.html()).toMatchSnapshot()
  })

  test(`
    shows the following opening hours:
    * Monday - Friday: 11:30 - 14:00, 18:30 - 22:00
    * Saturday - Sunday: Closed
  `, () => {
    const wrapper = mount(BusinessCardOpeningHours, {
      props: {
        openingHours: [
          {
            id: 0,
            day: 'monday',
            hours: [
              { start: '11:30', end: '14:00' },
              { start: '18:30', end: '22:00' }
            ]
          },
          {
            id: 1,
            day: 'tuesday',
            hours: [
              { start: '11:30', end: '14:00' },
              { start: '18:30', end: '22:00' }
            ]
          },
          {
            id: 2,
            day: 'wednesday',
            hours: [
              { start: '11:30', end: '14:00' },
              { start: '18:30', end: '22:00' }
            ]
          },
          {
            id: 3,
            day: 'thursday',
            hours: [
              { start: '11:30', end: '14:00' },
              { start: '18:30', end: '22:00' }
            ]
          },
          {
            id: 4,
            day: 'friday',
            hours: [
              { start: '11:30', end: '14:00' },
              { start: '18:30', end: '22:00' }
            ]
          },
          {
            id: 5,
            day: 'saturday',
            hours: []
          },
          {
            id: 6,
            day: 'sunday',
            hours: []
          }
        ],
      },
      global: {plugins: [vuetify]}
    })
  
    expect(wrapper.html()).toMatchSnapshot()
  })
})
