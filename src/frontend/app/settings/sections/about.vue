<script setup lang="ts">
import { APP_INFO } from '../../core/app-info';
import Link from '../../generics/link.vue';
</script>

<template>
  <div class="content-flow">
    <h1>About</h1>
    <hr />

    <div class="app-info">
      <div class="app-info__logo">
        <div class="app-logo">
          <div class="app-logo__image">
            <img src="/opz-logo.png" alt="OpZ Logo" />
          </div>
          <div class="app-logo__label">OpZ</div>
        </div>
      </div>

      <div class="app-info__details">
        <div class="content-flow">
          <dl class="dl--aligned">
            <dt>Version</dt>
            <dd>
              <samp>{{ APP_INFO.version }}</samp>
            </dd>
            <dt>Repository</dt>
            <dd>
              <Link href="https://github.com/simbo/opz"><samp>github.com/simbo/opz</samp></Link>
            </dd>
            <dt>License</dt>
            <dd><Link href="https://simbo.mit-license.org/2025/">MIT License</Link> © 2025</dd>
            <dt>Author</dt>
            <dd><Link href="https://simbo.de/">Simon Lepel</Link></dd>
          </dl>

          <hr class="hr--s" />

          <dl class="dl--aligned">
            <dt>Electron</dt>
            <dd>
              <samp>{{ APP_INFO.electronVersion }}</samp>
            </dd>
            <dt>Chromium</dt>
            <dd>
              <samp>{{ APP_INFO.chromeVersion }}</samp>
            </dd>
            <dt>Node.js</dt>
            <dd>
              <samp>{{ APP_INFO.nodeVersion }}</samp>
            </dd>
            <dt>V8</dt>
            <dd>
              <samp>{{ APP_INFO.v8Version }}</samp>
            </dd>
          </dl>
        </div>
      </div>
    </div>

    <hr />

    <p class="small muted centered">
      Icons and styles are based on <Link href="https://primer.style/">GitHub's Primer.</Link><br />
      The OpZ project is not connected to GitHub in any way.
    </p>
  </div>
</template>

<style scoped lang="scss">
.app-info {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin: 4em auto;
  width: fit-content;
  border: var(--border-width--m) solid var(--border-color--default);
  border-radius: var(--border-radius--l);
  background: var(--bg-color--neutral-muted);
  padding: 2em 0;
  box-shadow: var(--shadow__rest--m);

  &__logo {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    padding: 0 3em;
  }

  &__details {
    display: flex;
    align-items: center;
    padding: 0 3em;
    flex: 1 1 auto;
    border-left: var(--border-width--s) solid var(--border-color--default);
  }

  @media screen and (max-width: 925px) {
    flex-direction: column;
    margin: 2em auto;
    padding: 2em;

    &__logo {
      padding: 1em 0 1.5em 0;
    }

    &__details {
      border-left: none;
      border-top: var(--border-width--s) solid var(--border-color--default);
      padding: 2em 0 0 0;
    }
  }
}

.app-logo {
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75em;

  &__image {
    flex: 0 0 auto;

    img {
      width: 12em;
      height: auto;
      border-radius: var(--border-radius--l);
      border: var(--border-width--m) solid var(--border-color--default);
      box-shadow: var(--shadow__rest--m);
      display: block;
    }
  }

  &__label {
    font-weight: 700;
    font-size: 3em;
  }
}
</style>
