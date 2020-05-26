<template>
  <div class="p-dashboard">
    <div class="o-card p-dashboard__head">
      <h2 class="p-dashboard__page">
        Statistics for:
        <select v-model="page" class="p-dashboard__select">
          <option v-for="(item, key) in config" :key="'page-select-' + key" :value="key">
            {{ item.title }}
          </option>
        </select>
      </h2>
      <div :class="{'is-open': triggerOpen}" class="s-trigger">
        <button @click="toggleTrigger" class="s-trigger__button button">
          Manual Test
        </button>
        <form @submit.prevent="handleSubmit" class="s-trigger__dialog">
          <div class="s-trigger__inputs">
            <label for="test-trigger-key" class="sr-only">Force Key</label>
            <input id="test-trigger-key" v-model="forceKey" type="text" class="s-trigger__key" placeholder="Force key... (optional)">
            <button type="submit" class="s-trigger__go button">
              Go
            </button>
          </div>
          <p :class="'s-trigger__text s-trigger__text--' + triggerStatus">
            {{ triggerText || 'A valid force key will trigger a test regardless of the allowed test frequency.' }}
          </p>
        </form>
      </div>
    </div>
    <div class="o-card">
      <LineChart :data="completed" type="load" />
    </div>
    <div class="o-card">
      <LineChart :data="completed" type="render" />
    </div>
    <div class="o-card">
      <LineChart :data="completed" type="lighthouse" />
    </div>
    <div class="o-card o-card--noPadding">
      <ContentTabs :data="completed" />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import LineChart from '~/components/Charts/Line'
import ContentTabs from '~/components/ContentTabs'

export default {
  components: {
    LineChart,
    ContentTabs
  },
  asyncData({ params }) {
    const baseUrl = process.env.dev ? 'http://localhost:34567' : ''
    return axios.get(baseUrl + '/.netlify/functions/getAll')
      .then((res) => {
        const out = { data: res.data, config: {} }
        return axios.get(baseUrl + '/.netlify/functions/getConfig')
          .then((res) => {
            out.config = {}
            res.data.forEach((el) => {
              out.config[el.id] = el
            })
            return out
          })
      })
  },
  data: () => ({
    page: 'home',
    triggerOpen: false,
    forceKey: '',
    triggerText: false,
    triggerStatus: 'normal'
  }),
  computed: {
    completed() {
      return this.data.filter(d => d.status === 'completed').filter(d => d.page === this.page)
    }
  },
  methods: {
    toggleTrigger() {
      this.triggerText = false
      this.triggerStatus = 'normal'
      this.triggerOpen = !this.triggerOpen
    },
    handleSubmit() {
      const baseUrl = process.env.dev ? 'http://localhost:34567' : ''
      let url = baseUrl + '/.netlify/functions/trigger?id=' + this.page
      if (this.forceKey) {
        url = url + '&force=' + this.forceKey
      }
      axios.get(url)
        .then((res) => {
          const response = res.data[0]
          if (response.statusCode === 200) {
            this.triggerText = 'Success, triggered test'
            this.triggerStatus = 'success'
            return
          }

          this.triggerText = response.reason
          this.triggerStatus = 'error'
        })
        .catch((error) => {
          this.triggerText = error.response.data.reason
          this.triggerStatus = 'error'
        })
    }
  }
}
</script>

<style lang="scss">
.p-dashboard {
  &__page {
    margin: 0;
  }

  &__head {
    align-items: center;
    display: flex;
  }

  &__select {
    background: lighten($layout-border, 2%);
    border-radius: 3px;
    font-weight: inherit;
    margin-left: 1ch;
    padding: .25rem .5rem;

    option {
      font-weight: inherit;
    }
  }
}

.s-trigger {
  $self: &;

  margin-left: auto;
  position: relative;

  &.is-open {
    #{$self}__button {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    #{$self}__dialog {
      display: block;
    }
  }

  &__dialog {
    background: $main-bg;
    border: 1px solid $layout-border;
    border-radius: 5px 0 5px 5px;
    box-shadow: 1px 2px 10px rgba($black, .13);
    display: none;
    font-size: .675rem;
    min-width: 400px;
    padding: 5px;
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 12;

    p {
      margin: 5px 5px 0;
    }
  }

  &__inputs {
    display: flex;
  }

  &__key:not(.dud) {
    border: 1px solid $layout-border;
    border-radius: 4px 0 0 4px;
    margin: 0;
  }

  &__go {
    border-radius: 0 4px 4px 0;
  }

  &__text {
    &--success {
      color: #368036;
      font-weight: $font-bold;
    }

    &--error {
      color: #f00;
      font-weight: $font-bold;
    }
  }
}
</style>
