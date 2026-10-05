<template>
  <section class="text-center py-5">
    <i class="bi bi-signpost-split display-1 texto-primario"></i>
    <h1 class="h3 mt-3">Página não encontrada</h1>
    <p class="text-muted">O endereço acessado não existe.</p>
    <router-link to="/" class="btn btn-primaria">Ir para a lista de deputados</router-link>
  </section>
</template>

<script>
export default {
  name: 'PaginaNaoEncontrada'
}
</script>
