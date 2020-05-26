<template>
  <div class="c-lineChart">
    <div v-if="dateButtons" class="c-lineChart__toolbar">
      <button :class="{ 'is-active': dateRange === '1w' }" @click="updateRange('1w')" class="c-lineChart__button" title="1 Week">
        1W
      </button>
      <button :class="{ 'is-active': dateRange === '1m' }" @click="updateRange('1m')" class="c-lineChart__button" title="1 Month">
        1M
      </button>
      <button :class="{ 'is-active': dateRange === '6m' }" @click="updateRange('6m')" class="c-lineChart__button" title="6 Months">
        6M
      </button>
      <button :class="{ 'is-active': dateRange === '1y' }" @click="updateRange('1y')" class="c-lineChart__button" title="1 Year">
        1Y
      </button>
      <button :class="{ 'is-active': dateRange === 'ytd' }" @click="updateRange('ytd')" class="c-lineChart__button" title="Year to date">
        YTD
      </button>
      <button :class="{ 'is-active': dateRange === 'all' }" @click="updateRange('all')" class="c-lineChart__button" title="All">
        ALL
      </button>
    </div>
    <apexchart :options="options" :series="series" type="line" height="500" />
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    type: {
      type: String,
      default: ''
    },
    dateButtons: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    dateRange: 'all',
    minDate: undefined,
    maxDate: undefined
  }),
  computed: {
    typeData() {
      switch (this.type) {
      case 'load':
        return {
          title: 'Load Time',
          yLabel: 'Load Time (s)'
        }
      case 'render':
        return {
          title: 'Render Time',
          yLabel: 'Render Time (s)'
        }
      case 'lighthouse':
        return {
          title: 'Lighthouse Scores',
          yLabel: 'Score (%)'
        }
      case 'content-size':
        return {
          title: 'Content Breakdown — Size',
          yLabel: 'Size (kb)'
        }
      case 'content-requests':
        return {
          title: 'Content Breakdown — Requests',
          yLabel: 'Number of Requests'
        }
      }
      return {
        title: '',
        yLabel: ''
      }
    },
    options() {
      return {
        chart: {
          fontFamily: '"Average Sans", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
          toolbar: {
            tools: {
              pan: false,
              reset: false
            }
          },
          events: {
            beforeZoom: () => this.resetRange()
          },
          animations: {
            easing: 'easeinout'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: this.typeData.title,
          align: 'center',
          offsetY: 15,
          style: {
            fontSize: '1.125rem'
          }
        },
        zoom: {
          type: 'x',
          enabled: true
        },
        xaxis: {
          type: 'datetime',
          min: this.minDate,
          max: this.maxDate,
          labels: {
            style: {
              fontSize: '.875rem'
            }
          }
        },
        yaxis: {
          min: 0,
          labels: {
            style: {
              fontSize: '.875rem'
            },
            formatter(val) {
              return val.toFixed(0)
            }
          },
          title: {
            text: this.typeData.yLabel,
            style: {
              fontSize: '1rem'
            }
          }
        },
        tooltip: {
          shared: true,
          y: {
            formatter: (val) => {
              switch (this.type) {
              case 'load':
              case 'render':
                return val.toFixed(2) + 's'

              case 'lighthouse':
                return val.toFixed(0) + '%'

              case 'content-size':
                return val.toFixed(2) + 'kB'
              }
              return val.toFixed(0)
            }
          },
          x: {
            format: 'HH:mm - dd MMM yyyy'
          }
        },
        legend: {
          offsetY: -10,
          itemMargin: {
            horizontal: 10,
            vertical: 5
          },
          fontSize: '15rem'
        }
      }
    },
    series() {
      switch (this.type) {
      case 'load':
        return [
          {
            name: 'First Byte',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.load.ttfb / 1000
            ]))
          },
          {
            name: 'Document Complete',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.load.document / 1000
            ]))
          },
          {
            name: 'Fully Loaded',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.load.full / 1000
            ]))
          }
        ]
      case 'render':
        return [
          {
            name: 'Start Render',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.render.start / 1000
            ]))
          },
          {
            name: 'Speed Index',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.render.speedIndex / 1000
            ]))
          },
          {
            name: 'Visually Complete',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.render.visual / 1000
            ]))
          }
        ]
      case 'lighthouse':
        return [
          {
            name: 'Accessibility',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.lighthouse.accessibility * 100
            ]))
          },
          {
            name: 'Best Practices',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.lighthouse.bestPractices * 100
            ]))
          },
          {
            name: 'Performance',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.lighthouse.performance * 100
            ]))
          },
          {
            name: 'Progressive Web App',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.lighthouse.pwa * 100
            ]))
          },
          {
            name: 'Search Engine Optimisation',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.lighthouse.seo * 100
            ]))
          }
        ]
      case 'content-size':
        return [
          {
            name: 'HTML',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.html.bytes / 1000
            ]))
          },
          {
            name: 'CSS',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.css.bytes / 1000
            ]))
          },
          {
            name: 'JavaScript',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.js.bytes / 1000
            ]))
          },
          {
            name: 'Images',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.image.bytes / 1000
            ]))
          },
          {
            name: 'Fonts',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.font.bytes / 1000
            ]))
          },
          {
            name: 'Other',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.other.bytes / 1000
            ]))
          }
        ]
      case 'content-requests':
        return [
          {
            name: 'HTML',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.html.requests
            ]))
          },
          {
            name: 'CSS',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.css.requests
            ]))
          },
          {
            name: 'JavaScript',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.js.requests
            ]))
          },
          {
            name: 'Images',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.image.requests
            ]))
          },
          {
            name: 'Fonts',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.font.requests
            ]))
          },
          {
            name: 'Other',
            data: this.data.map(d => ([
              new Date(d.completed['@ts']).getTime(),
              d.content.other.requests
            ]))
          }
        ]
      }
      return false
    }
  },
  mounted() {
    this.maxDate = dayjs().valueOf()
  },
  methods: {
    updateRange(range) {
      this.dateRange = range
      this.maxDate = dayjs().valueOf()

      switch (range) {
      case '1m':
        this.minDate = dayjs().subtract(1, 'month').valueOf()
        break

      case '6m':
        this.minDate = dayjs().subtract(6, 'month').valueOf()
        break

      case '1y':
        this.minDate = dayjs().subtract(1, 'year').valueOf()
        break

      case 'ytd':
        this.minDate = dayjs().set('date', 1).set('month', 0).valueOf()
        break

      default:
        this.minDate = undefined
      }
    },
    resetRange() {
      this.dateRange = false
    }
  }
}
</script>

<style lang="scss">
.c-lineChart {
  position: relative;

  &__toolbar {
    left: 30px;
    position: absolute;
    top: 0;
    z-index: 1;
  }

  &__button {
    background: $white;
    border: 1px solid $layout-border;
    border-radius: 2px;
    color: $text-colour;
    cursor: pointer;
    font-size: .875rem;
    outline: none;
    padding: .25rem 1rem;

    &:hover {
      background: rgba($layout-border, .5);
    }

    &.is-active {
      background: $highlight-colour;
      border-color: $highlight-colour;
      color: $white;

      &:hover {
        background: darken($highlight-colour, 5%);
        border-color: darken($highlight-colour, 5%);
        color: $white;
      }
    }
  }
}
</style>
