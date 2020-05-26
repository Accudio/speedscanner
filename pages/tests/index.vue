<template>
  <div class="p-tests o-card">
    <h2>All Tests</h2>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :sort-options="{
        initialSortBy: {field: 'started', type: 'desc'}
      }"
      :pagination-options="{
        enabled: true,
        perPage: 10
      }"
      class="p-tests__table"
    >
      <template slot="table-row" slot-scope="props">
        <div v-if="props.column.field == 'links'" class="p-tests__buttons">
          <nuxt-link :to="'/tests/' + props.row.id" class="p-tests__button button">
            Details
          </nuxt-link>
          <a v-if="hasWPT(props.row)" :href="props.row.links.wpt" class="p-tests__button button" target="_blank" rel="noopener noreferrer">
            WPT
            <Icon-ExternalLink />
          </a>
        </div>
        <template v-else>
          {{ props.formattedRow[props.column.field] }}
        </template>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
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
    columns: [
      {
        label: 'ID',
        field: 'id',
        sortable: false
      },
      {
        label: 'Page',
        field: 'page',
        filterOptions: {
          enabled: true,
          filterDropdownItems: [
            'Covey Digital',
            'Homepage'
          ]
        }
      },
      {
        label: 'Test Started',
        field: 'started',
        type: 'date',
        dateInputFormat: 'T',
        dateOutputFormat: 'dd/MM/yyyy - HH:mm'
      },
      {
        label: 'Status',
        field: 'status'
      },
      {
        label: '',
        field: 'links',
        sortable: false,
        html: true
      }
    ]
  }),
  computed: {
    rows() {
      return this.data.map((d) => {
        return {
          id: d.id,
          page: this.config[d.page].title,
          started: Date.parse(d.started['@ts']),
          status: d.status,
          links: {
            wpt: d.urls.user
          }
        }
      })
    }
  },
  methods: {
    hasWPT(test) {
      return dayjs(test.started).add(3, 'month').isAfter(dayjs())
    }
  }
}
</script>

<style lang="scss">
.p-tests {
  .vgt-table thead th {
    &.sorting-desc::before {
      border-top: 5px solid $highlight-colour;
    }

    &.sorting-asc::after {
      border-bottom: 5px solid $highlight-colour;
    }
  }
}
</style>
