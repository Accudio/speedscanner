<template>
  <div class="c-contentTabs">
    <div class="c-contentTabs__tabs">
      <button :class="{'is-active': tab === 'size'}" @click="tab = 'size'" class="c-contentTabs__tab">
        Content Breakdown &mdash; Size
      </button>
      <button :class="{'is-active': tab === 'requests'}" @click="tab = 'requests'" class="c-contentTabs__tab">
        Content Breakdown &mdash; Requests
      </button>
    </div>
    <div class="c-contentTabs__main">
      <div v-if="tab === 'size'">
        <LineChart :data="data" type="content-size" />
      </div>
      <div v-if="tab === 'requests'">
        <LineChart :data="data" type="content-requests" />
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '~/components/Charts/Line'

export default {
  components: {
    LineChart
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    tab: 'size'
  })
}
</script>

<style lang="scss">
.c-contentTabs {
  &__tabs {
    display: flex;
  }

  &__tab {
    background: none;
    border: 0;
    border-bottom: 1px solid $layout-border;
    box-shadow: inset 0 0 20px 0 rgba($black, .25);
    cursor: pointer;
    flex: 0 0 50%;
    font-size: 1.25rem;
    max-width: 50%;
    opacity: .5;
    outline: none;
    padding: 1rem;
    transition: all .2s;

    &:first-child {
      border-radius: 5px 0 0;
    }

    &:last-child {
      border-radius: 0 5px 0 0;
    }

    &.is-active {
      box-shadow: none;
      opacity: 1;
    }
  }

  &__main {
    padding: 1.25rem 2rem;
  }
}
</style>
