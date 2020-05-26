<template>
  <div class="l-page">
    <Header />

    <div class="l-page__contain">
      <Nav />

      <main class="l-main">
        <div class="l-main__inner">
          <nuxt />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header'
import Nav from '~/components/Nav'

export default {
  components: {
    Header,
    Nav
  }
}
</script>

<style lang="scss">
.l-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  &__contain {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
  }
}

.l-header {
  flex: 0 0 $header-height;
  flex: 0 0 var(--header-height);
}

.l-nav {
  flex: 0 0 $sidebar-width;
  flex: 0 0 var(--sidebar-width);
}

.l-main {
  background: $main-bg;
  flex: 1 1 auto;
  overflow-x: hidden;
  overflow-y: auto;

  &__inner {
    box-shadow: inset 1px 1px 6px 0 rgba($black, .16);
    min-height: 100%;
    padding: 30px;
  }
}
</style>
