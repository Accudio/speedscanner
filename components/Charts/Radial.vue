<template>
  <div class="c-radialChart">
    <apexchart :options="options" :series="series" type="radialBar" height="250" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    options() {
      return {
        chart: {
          fontFamily: '"Average Sans", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
        },
        labels: [this.title],
        colors: [this.colour],
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%'
            },
            dataLabels: {
              name: {
                fontSize: '1.125rem'
              },
              value: {
                fontSize: '1rem'
              }
            }
          }
        }
      }
    },
    series() {
      return [(this.data * 100).toFixed(0)]
    },
    colour() {
      const greenMax = 210
      const redMax = 210
      let red, green

      if (this.data < 0.5) {
        red = redMax
        green = Math.round((this.data / 0.5) * greenMax)
      } else {
        green = greenMax
        red = Math.round((1 - ((this.data - 0.5) / 0.5)) * redMax)
      }

      // return { red, green }
      return '#' + this.componentToHex(red) + this.componentToHex(green) + '00'
    }
  },
  methods: {
    componentToHex(c) {
      const hex = c.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
  }
}
</script>
