<template>
  <div class="card h-100 shadow-sm card-deputado" @click="abrirDetalhes">
    <button
      type="button"
      class="btn btn-sm btn-light rounded-circle botao-favorito"
      :title="isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
      @click.stop="$emit('alternar-favorito', id)"
    >
      <i class="bi" :class="isFavorito ? 'bi-star-fill text-warning' : 'bi-star'"></i>
    </button>

    <img
      class="rounded-circle mx-auto mt-4 foto"
      :src="foto"
      :alt="`Foto de ${nome}`"
      loading="lazy"
    />
    <div class="card-body text-center">
      <h5 class="card-title mb-2">{{ nome }}</h5>
      <span class="badge bg-success me-1">{{ partido }}</span>
      <span class="badge bg-secondary">{{ uf }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardDeputado',
  emits: ['alternar-favorito'],
  props: {
    id: Number,
    foto: String,
    nome: String,
    partido: String,
    uf: String,
    isFavorito: Boolean
  },
  methods: {
    abrirDetalhes() {
      this.$router.push({ name: 'detalhes', params: { id: this.id } })
    }
  }
}
</script>

<style scoped>
.card-deputado {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-deputado:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.foto {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border: 3px solid var(--cor-destaque);
}

.botao-favorito {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
