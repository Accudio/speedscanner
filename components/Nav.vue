<template>
  <aside class="l-nav">
    <ul class="l-nav__list">
      <li>
        <nuxt-link class="l-nav__link" to="/">
          Dashboard
        </nuxt-link>
      </li>
      <li>
        <nuxt-link class="l-nav__link" to="/tests">
          All Tests
        </nuxt-link>
      </li>
    </ul>
    <div class="l-nav__footer">
      <a class="l-nav__logoLink" href="https://speedscanner.org">
        <img class="l-nav__logo" src="~/assets/img/icon.svg" alt="Speedscanner">
      </a>
      <div class="l-nav__credits">
        <p>Powered by <a href="https://speedscanner.org">Speedscanner</a> and <a href="https://www.webpagetest.org/">WebPageTest</a></p>
        <p>An open-source project built by <a href="https://alistairshepherd.uk">Alistair Shepherd</a></p>
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
.l-nav {
  border-right: 1px solid $layout-border;
  display: flex;
  flex-direction: column;
  padding: 30px 0 10px;

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: block;
    }
  }

  &__link:not(#\9) {
    color: $text-colour--l;
    display: flex;
    font-size: 1.125rem;
    padding: 1rem 2rem;
    transition: all .2s;
    width: 100%;

    &:hover {
      color: $text-colour;
    }

    &.nuxt-link-exact-active {
      background: rgba($layout-border, .25);
      color: $text-colour;
    }
  }

  &__footer {
    font-size: .75rem;
    font-weight: $font-medium;
    margin-top: auto;
    text-align: center;

    p {
      margin-bottom: .25rem;
    }

    a {
      color: $highlight-colour;
      font-weight: $font-bold;
      text-decoration: underline;
    }
  }

  &__logoLink {
    display: block;
    margin-bottom: 1rem;
  }

  &__logo {
    width: 3rem;
  }
}
</style>
