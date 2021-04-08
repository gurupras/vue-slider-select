/* eslint-disable import/no-extraneous-dependencies */
// import { action } from '@storybook/addon-actions'

import SliderSelect from '../components/slider-select.vue'

export default {
  title: 'Slider Select'
}

export const withText = () => ({
  components: { SliderSelect },
  template: `
  <div style="margin: auto; width: 50%">
    <SliderSelect :options="options"/>
  </div>
  `,
  data () {
    return {
      options: [
        'One',
        {
          label: 'Two'
        },
        'Three',
        'Four'
        // 'Five',
        // 'Six',
        // 'Seven'
      ]
    }
  }
})
