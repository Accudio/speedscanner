<template>
  <div class="p-singleTest o-cardGrid">
    <div class="o-cardGrid__item">
      <div class="o-card">
        <h2>Test Details</h2>
        <table>
          <tbody>
            <tr>
              <th>Test ID:</th>
              <td>{{ data.id }}</td>
            </tr>
            <tr>
              <th>URL:</th>
              <td>{{ data.url }}</td>
            </tr>
            <tr>
              <th>Status:</th>
              <td>{{ data.wptStatus || data.status }}</td>
            </tr>
            <tr>
              <th>Started:</th>
              <td>{{ formatTime(data.started['@ts']) }}</td>
            </tr>
            <tr v-if="data.completed">
              <th>Completed:</th>
              <td>{{ formatTime(data.completed['@ts']) }}</td>
            </tr>
            <tr v-if="hasWPT">
              <th>WebPageTest Results:</th>
              <td><a :href="data.urls.user" target="_blank" rel="noopener noreferrer">{{ data.urls.user.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '') }} <Icon-ExternalLink /></a></td>
            </tr>
          </tbody>
        </table>
        <button v-if="data.status === 'pending'" @click="updateTest()" class="button p-singleTest__refresh" title="Manually recheck test status if automated pingback hasn't triggered">
          <Icon-Refresh /> Refresh Status
        </button>
      </div>
    </div>

    <template v-if="data.status === 'completed'">
      <div class="o-cardGrid__item o-cardGrid__item--2">
        <div class="o-card p-singleTest__times">
          <h2>Load Times</h2>
          <table class="p-singleTest__timesTable">
            <thead>
              <tr>
                <th v-for="(item, key) in data.load" :key="'load-head-' + key">
                  {{ labels.load[key] }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(item, key) in data.load" :key="'load-' + key">
                  {{ formatDuration(item) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="o-cardGrid__item o-cardGrid__item--2">
        <div class="o-card p-singleTest__times">
          <h2>Render Times</h2>
          <table class="p-singleTest__timesTable">
            <thead>
              <tr>
                <th v-for="(item, key) in data.render" :key="'load-head-' + key">
                  {{ labels.render[key] }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(item, key) in data.render" :key="'load-' + key">
                  {{ formatDuration(item) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="o-cardGrid__item">
        <div class="o-card">
          <h2>Lighthouse Scores</h2>
          <div class="p-singleTest__lighthouse">
            <template v-for="(item, key) in data.lighthouse">
              <RadialChart :key="'lighthouse-' + key" :data="item" :title="labels.lighthouse[key]" class="p-singleTest__lighthouseItem" />
            </template>
          </div>
        </div>
      </div>

      <div class="o-cardGrid__item o-cardGrid__item--2">
        <div class="o-card">
          <h2>Content Breakdown &ndash; Size</h2>
          <DonutChart :data="data" type="content-size" />
        </div>
      </div>

      <div class="o-cardGrid__item o-cardGrid__item--2">
        <div class="o-card">
          <h2>Content Breakdown &ndash; Requests</h2>
          <DonutChart :data="data" type="content-requests" />
        </div>
      </div>

      <div class="o-cardGrid__item">
        <div class="o-card p-singleTest__waterfall">
          <h2>Waterfall</h2>
          <img :src="data.waterfall">
        </div>
      </div>

      <div class="o-cardGrid__item">
        <div class="o-card p-singleTest__filmstrip">
          <h2>Filmstrip</h2>
          <ul class="p-singleTest__filmstripList">
            <li v-for="(screenshot, i) in data.filmstrip" :key="'filmstrip-' + i" class="p-singleTest__filmstripItem">
              <img :src="screenshot.image" class="p-singleTest__filmstripImg">
              <div class="p-singleTest__filmstripFoot">
                <div class="p-singleTest__filmstripCol p-singleTest__filmstripCol--time">
                  <div class="p-singleTest__filmstripLabel">
                    Time:
                  </div>
                  {{ formatDuration(screenshot.time) }}
                </div>
                <div class="p-singleTest__filmstripCol p-singleTest__filmstripCol--visual">
                  <div class="p-singleTest__filmstripLabel">
                    Visually Complete:
                  </div>
                  {{ screenshot.VisuallyComplete }}%
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import DonutChart from '~/components/Charts/Donut'
import RadialChart from '~/components/Charts/Radial'

export default {
  components: {
    DonutChart,
    RadialChart
  },
  asyncData({ params }) {
    const baseUrl = process.env.dev ? 'http://localhost:34567' : ''
    return axios.get(baseUrl + '/.netlify/functions/getById?id=' + params.id)
      .then((res) => {
        return { data: res.data }
      })
  },
  data: () => ({
    labels: {
      content: {
        html: 'HTML',
        css: 'CSS',
        js: 'JavaScript',
        image: 'Images',
        font: 'Fonts',
        other: 'Other'
      },
      lighthouse: {
        accessibility: 'Accessibility',
        bestPractices: 'Best Practices',
        performance: 'Performance',
        pwa: 'PWA',
        seo: 'SEO'
      },
      load: {
        ttfb: 'TTFB',
        full: 'Fully Loaded',
        document: 'Document Complete'
      },
      render: {
        speedIndex: 'Speed Index',
        start: 'Start Render',
        visual: 'Visually Complete'
      }
    }
  }),
  computed: {
    hasWPT() {
      return dayjs(this.data.started['@ts']).add(3, 'month').isAfter(dayjs())
    }
  },
  methods: {
    updateTest() {
      const baseUrl = process.env.dev ? 'http://localhost:34567' : ''
      axios.get(baseUrl + '/.netlify/functions/pingback?id=' + this.data.id)
        .then((res) => {
          this.data = res.data
        })
    },
    formatTime(time) {
      return dayjs(time).format('DD/MM/YYYY - HH:mm:ss')
    },
    formatDuration(duration) {
      return (duration / 1000).toFixed(2) + 's'
    }
  }
}
</script>

<style lang="scss">
.p-singleTest {
  &__refresh {
    position: absolute;
    right: 2rem;
    top: 1.25rem;

    .feather {
      margin-right: .25em;
    }
  }

  &__timesTable {
    th, td {
      text-align: center;
      width: 33.33%;
    }
  }

  &__lighthouse {
    display: flex;
    flex-wrap: wrap;
  }

  &__lighthouseItem {
    flex: 1 0 150px;
  }

  &__waterfall {
    text-align: center;
  }

  &__filmstripList {
    display: flex;
    list-style: none;
    margin: 0 -2rem -1.25rem;
    overflow: auto;
    padding: 0 0 1.25rem;

    &::after {
      content: '';
      display: block;
      flex: 0 0 1px;
      height: 1px;
      max-width: 1px;
    }
  }

  &__filmstripItem {
    flex: 0 0 auto;
    margin: 0 5px;

    &:first-child {
      margin-left: 2rem;
    }

    &:last-child {
      margin-right: 2rem;
    }
  }

  &__filmstripImg {
    border: 1px solid $layout-border;
  }

  &__filmstripFoot {
    display: flex;
  }

  &__filmstripCol {
    background: $layout-border;
    display: flex;
    flex: 0 0 50%;
    flex-direction: column-reverse;
    font-size: 1.875rem;
    font-weight: $font-bold;
    line-height: 1;
    max-width: 50%;
    padding: .75rem 1rem;
    text-align: center;

    &--visual {
      background: darken($layout-border, 5%);
    }
  }

  &__filmstripLabel {
    font-size: .75rem;
    margin-top: .75rem;
    text-transform: uppercase;
  }

  a {
    text-decoration: underline;
  }
}
</style>
