<template>
  <header class="l-header">
    <a class="l-header__link" href="https://speedscanner.org">
      <img class="l-header__logo" src="~/assets/img/logo.svg" alt="Speedscanner">
    </a>
  </header>
</template>

<style lang="scss">
.l-header {
  border-bottom: 1px solid $layout-border;
  display: flex;
  justify-content: center;
  padding: .5rem 0;

  &__logo {
    height: 4rem;
  }
}
</style>
