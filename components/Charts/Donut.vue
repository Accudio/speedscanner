<template>
  <div class="c-pieChart">
    <apexchart :options="options" :series="series" type="donut" height="500" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    typeData() {
      switch (this.type) {
      case 'content-size':
        return {
          title: 'Content Breakdown — Size'
        }
      case 'content-requests':
        return {
          title: 'Content Breakdown — Requests'
        }
      }
      return {
        title: ''
      }
    },
    options() {
      return {
        chart: {
          fontFamily: '"Average Sans", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
          animations: {
            easing: 'easeinout'
          }
        },
        dataLabels: {
          style: {
            fontSize: '.875rem'
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            color: '#000',
            opacity: 0.2
          }
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  fontSize: '1.5rem'
                },
                value: {
                  fontSize: '2rem'
                },
                total: {
                  show: true,
                  showAlways: true,
                  formatter: () => (this.total)
                }
              }
            }
          }
        },
        labels: [
          'HTML',
          'CSS',
          'JavaScript',
          'Images',
          'Fonts',
          'Other'
        ],
        stroke: {
          width: 0
        },
        legend: {
          offsetY: 0,
          fontSize: '13rem'
        },
        tooltip: {
          y: {
            formatter: (val) => {
              if (this.type === 'content-size') {
                return val.toFixed(2) + 'kB'
              }
              return val
            }
          }
        }
      }
    },
    series() {
      switch (this.type) {
      case 'content-size':
        return [
          this.data.content.html.bytes / 1000,
          this.data.content.css.bytes / 1000,
          this.data.content.js.bytes / 1000,
          this.data.content.image.bytes / 1000,
          this.data.content.font.bytes / 1000,
          this.data.content.other.bytes / 1000
        ]
      case 'content-requests':
        return [
          this.data.content.html.requests,
          this.data.content.css.requests,
          this.data.content.js.requests,
          this.data.content.image.requests,
          this.data.content.font.requests,
          this.data.content.other.requests
        ]
      }
      return false
    },
    total() {
      const total = this.series.reduce((a, b) => a + b, 0)
      if (this.type === 'content-size') {
        return total.toFixed(0) + 'kB'
      }
      return total
    }
  }
}
</script>
