<template>
  <div class="text-center py-5">
    <div class="spinner-border texto-primario" role="status">
      <span class="visually-hidden">Carregando</span>
    </div>
    <p class="text-muted mt-2 mb-0">{{ mensagem }}</p>
  </div>
</template>

<script>
export default {
  name: 'CarregandoSpinner',
  props: {
    mensagem: { type: String, default: 'Carregando...' }
  }
}
</script>
