<template>
  <header class="topo shadow-sm">
    <nav class="container d-flex align-items-center justify-content-between py-3">
      <router-link to="/" class="text-white text-decoration-none fs-5 fw-semibold">
        <i class="bi bi-bank2 me-2"></i>Deputados Federais
      </router-link>
      <span class="badge bg-warning text-dark d-none d-sm-inline">57ª Legislatura</span>
    </nav>
  </header>

  <main class="container py-4 flex-grow-1">
    <router-view />
  </main>

  <rodape-site />
</template>

<script>
import RodapeSite from './components/RodapeSite.vue'

export default {
  name: 'App',
  components: {
    RodapeSite
  }
}
</script>
