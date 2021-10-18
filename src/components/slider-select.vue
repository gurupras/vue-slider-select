<template>
<div class="slider-root">
  <select style="display: none;">
    <option v-for="option in options"
        :key="getKey(option)"
        :value="option"
        ref="options"/>
  </select>
  <div class="range">
    <input type="range"
        :min="0"
        :max="options.length -1"
        steps="1"
        v-model="rVal"
        :style="rangeStyle"
        ref="range">
    <slot name="markers">
      <div v-for="(option, idx) in options" :key="idx"
          class="marker"
          :class="getClass(idx)"
          :style="getLabelStyle(idx)"
          :disabled="option.disabled"
          @click="rVal = idx"/>
    </slot>
  </div>

  <ul class="range-labels">
    <slot name="labels">
      <li v-for="(option, idx) in options"
          :key="getKey(option)"
          :class="getClass(idx)"
          :style="getLabelStyle(idx)"
          :disabled="option.disabled"
          @click="rVal = idx"
          ref="labels">
        <slot :name="`label-${getKey(option)}`" :get-label="getLabel" :option="option" :index="idx">
          {{ getLabel(option) }}
        </slot>
      </li>

    </slot>
  </ul>
</div>
</template>

<script>
export default {
  name: 'slider-select',
  props: {
    options: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    value: {
      type: [Object, String],
      default () {
        return undefined
      }
    }
  },
  computed: {
    defaultIndex () {
      const { value = '' } = this
      if (value) {
        const valueKey = this.getKey(value)
        const valueLabel = this.getLabel(value)
        const valueValue = this.getValue(value)
        const valueIdx = this.options.findIndex(x => x === value || this.getKey(x) === valueKey || this.getValue(x) === valueValue || this.getLabel(x) === valueLabel)
        if (valueIdx >= 0) {
          return valueIdx
        }
      }
      const defaultVal = this.options.findIndex(x => x.default)
      return Math.max(defaultVal, 0)
    },
    rangeValue () {
      return Number(this.rVal)
    }
  },
  watch: {
    rangeValue (v, o) {
      if (this.options[v].disabled) {
        this.rVal = `${o}`
        return
      }
      this.selected = this.getValue(this.options[v])
    },
    selected (v) {
      this.$emit('input', v)
    }
  },
  data () {
    return {
      selected: undefined,
      rVal: 0,
      rangeStyle: {},
      eventID: undefined
    }
  },
  methods: {
    getLabel (option) {
      return option.label || option
    },
    getKey (option) {
      return option.key || this.getLabel(option)
    },
    getValue (option) {
      return option.value || this.getLabel(option)
    },
    getClass (idx) {
      if (idx === Number(this.rangeValue)) {
        return ['active', 'selected']
      }
      return []
    },
    getLabelStyle (idx) {
      let pct
      if (idx === 0) {
        pct = 0
      } else if (idx === this.options.length - 1) {
        pct = 100
      } else {
        pct = (idx / (this.options.length - 1)) * 100.0
      }
      return {
        '--position': `${pct}%`
      }
    }
  },
  beforeMount () {
    this.rVal = this.defaultIndex
  },
  mounted () {
    this.$forceUpdate()
  }
}
</script>

<style lang="scss" scoped>
.slider-root {
  --slider-height: 5px;
  --marker-radius: 9px;
  --thumb-radius: 18px;
  --label-color: #b2b2b2;
  --track-color: var(--label-color);
  --active-color: #37adbf;
  $half-marker-radius: calc(var(--marker-radius, 9px) / 2);
  $half-slider-height: calc(var(--slider-height) / 2);
  $half-thumb-radius: calc(var(--thumb-radius) / 2);

  @mixin rangeThumb {
    width: var(--thumb-radius);
    height: var(--thumb-radius);
    margin: calc(-1 * #{$half-thumb-radius}) 0;
    border-radius: 50%;
    background: var(--active-color);
    cursor: pointer;
    border: 0 !important;
  }

  @mixin rangeTrack {
    width: 100%;
    height: 2px;
    cursor: default;
    background: var(--track-color);
  }

  .range {
    position: relative;
    width: 100%;
    height: var(--slider-height);
    z-index: 1;

    input {
      width: 100%;
      position: absolute;
      top: 0px;
      height: 0;
      -webkit-appearance: none;

      // Thumb
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        @include rangeThumb;
      }

      &::-moz-range-thumb {
        @include rangeThumb;
      }

      &::-ms-thumb {
        @include rangeThumb;
      }

      // Track
      &::-webkit-slider-runnable-track {
        @include rangeTrack;
      }

      &::-moz-range-track {
        @include rangeTrack;
      }

      &::-ms-track {
        @include rangeTrack;
      }

      &:focus { // override outline/background on focus
        background: none;
        outline: none;
      }

      &::-ms-track {
        width: 100%;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
    }

    .marker {
      position: absolute;
      width: var(--marker-radius);
      height: var(--marker-radius);
      margin-top: calc(-1 * #{$half-slider-height});
      background: var(--label-color);
      border-radius: 50%;
      cursor: pointer;

      left: calc(var(--position));

      &:last-of-type {
        left: calc(var(--position) - #{$half-marker-radius});
      }

      &[disabled] {
        pointer-events: none;
      }

      &.active.selected {
        display: none;
        background: none;
      }
    }
  }

  // Labels below slider
  .range-labels {
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: 0px;
    justify-content: space-between;
    margin-top: $half-marker-radius;

    li {
      position: relative;
      text-align: center;
      color: var(--label-color);
      font-size: 16px;
      cursor: pointer;
      padding: 12px 0 0 0;
      display: flex;
    }

    *[disabled] & {
      pointer-events: none;
    }

    .active {
      color: var(--active-color);
    }
  }
}
</style>
