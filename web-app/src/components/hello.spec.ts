// TODO remove this file

import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import HelloWorld from '../../src/components/HelloWorld.vue'
import Alert from './Alert.vue'

const vuetify = createVuetify({
  components,
  directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

test('displays message', () => {
  const wrapper = mount({
    // template: '<v-layout><hello-world></hello-world></v-layout>'
    template: '<v-layout>test</v-layout>'
  }, {
    props: {},
    global: {
      // components: {
      //   HelloWorld,
      // },
      plugins: [vuetify],
    }
  })

  // Assert the rendered text of the component
  // expect(wrapper.text()).toContain('Components')
  console.log('------', wrapper.html())
})

test('displays message 2', () => {
  const wrapper = mount({
    // template: '<v-layout><hello-world></hello-world></v-layout>'
    template: '<v-layout><Alert message="test"/></v-layout>'
  }, {
    props: {},
    global: {
      components: {
        Alert,
      },
      plugins: [vuetify],
    }
  })

  // Assert the rendered text of the component
  // expect(wrapper.text()).toContain('Components')
  console.log('------', wrapper.html())
})

test('displays message 2', () => {
  const wrapper = mount(Alert, {
    props: { message: 'test3'},
    global: {
      // components: {
      //   Alert,
      // },
      plugins: [vuetify],
    }
  })

  // Assert the rendered text of the component
  // expect(wrapper.text()).toContain('Components')
  console.log('------', wrapper.html())
  expect(wrapper.html()).toMatchSnapshot()
})
