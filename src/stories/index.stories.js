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
    <SliderSelect :options="options" v-model="value" ref="slider">
      <template #label-Three="props">
        <span style="color: red">{{ props.getLabel(props.option) }}</span>
      </template>
    </SliderSelect>
  </div>
  `,
  data () {
    return {
      options: [
        'One',
        {
          label: 'Two'
        },
        {
          label: 'Three',
          disabled: true
        },
        'Four',
        'Five',
        'Six',
        'Seven'
      ],
      value: 'Four'
    }
  },
  mounted () {
    window.app = this
    window.slider = this.$refs.slider
  }
})
