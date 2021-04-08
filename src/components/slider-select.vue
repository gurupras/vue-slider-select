<template>
<div>
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
  </div>

  <ul class="range-labels">
    <li v-for="(option, idx) in options"
        :key="getKey(option)"
        :class="getClass(idx)"
        :style="getLabelStyle(idx)"
        :disabled="option.disabled"
        @click="rVal = idx"
        ref="labels">
      {{ getLabel(option) }}
    </li>
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
    }
  },
  computed: {
    defaultValue () {
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
      }
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
      eventID: undefined,
      startValue: undefined
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
    this.rVal = this.defaultValue
  }
}
</script>

<style lang="scss" scoped>
@mixin rangeThumb {
  width: 18px;
  height: 18px;
  margin: -9px 0;
  border-radius: 50%;
  background: var(--active-color, #37adbf);
  cursor: pointer;
  border: 0 !important;
}

@mixin rangeTrack {
  width: 100%;
  height: 2px;
  cursor: default;
  background: var(--track-color, #b2b2b2);
}

.range {
  position: relative;
  width: 100%;
  height: 5px;
}

.range input {
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

// Labels below slider
.range-labels {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: absolute;
    float: left;
    text-align: center;
    color: var(--label-color, #b2b2b2);
    font-size: 16px;
    cursor: pointer;
    left: var(--position);
    margin-top: 4.5px;
    padding: 13.5px 0 0 0;

    &:first-child {
      &::before {
      }
    }
    &:not(:first-child) {
      transform: translateX(-10px);
      &::before {
        left: -4.5px;
        transform: translateX(10px);
      }
    }

    &:last-child {
      right: 0;
    }

    &::before {
      position: absolute;
      top: calc(-25px + 13.5px);
      right: 0;
      left: 0;
      margin: 0;
      content: "";
      width: var(--marker-radius, 9px);
      height: var(--marker-radius, 9px);
      background: var(--label-color, #b2b2b2);
      border-radius: 50%;
      cursor: pointer;
    }

    &[disabled] {
      pointer-events: none;
    }
  }

  *[disabled] & {
    pointer-events: none;
  }

  .active {
    color: var(--active-color, #37adbf);
  }

  .selected::before {
    background: var(--active-color, #37adbf);
  }

  .active.selected::before {
    display: none;
    background: none;
  }
}
</style>
