<template>
  <form class="card card-body shadow-sm mb-4" @submit.prevent>
    <div class="row g-3 align-items-end">
      <div class="col-12 col-lg-5">
        <label for="busca-nome" class="form-label fw-semibold">Nome do deputado</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            id="busca-nome"
            v-model="textoBusca"
            type="search"
            class="form-control"
            placeholder="Ex.: Tabata, Nikolas, Erika..."
            @input="digitarNome"
          />
        </div>
      </div>

      <div class="col-6 col-lg-2">
        <label for="filtro-uf" class="form-label fw-semibold">Estado</label>
        <select id="filtro-uf" class="form-select" :value="uf" @change="atualizar({ uf: $event.target.value })">
          <option value="">Todos</option>
          <option v-for="estado in estados" :key="estado.sigla" :value="estado.sigla">
            {{ estado.sigla }} - {{ estado.nome }}
          </option>
        </select>
      </div>

      <div class="col-6 col-lg-2">
        <label for="filtro-partido" class="form-label fw-semibold">Partido</label>
        <select
          id="filtro-partido"
          class="form-select"
          :value="partido"
          @change="atualizar({ partido: $event.target.value })"
        >
          <option value="">Todos</option>
          <option v-for="sigla in partidos" :key="sigla" :value="sigla">{{ sigla }}</option>
        </select>
      </div>

      <div class="col-12 col-lg-3 d-flex gap-2">
        <input
          id="so-favoritos"
          type="checkbox"
          class="btn-check"
          :checked="soFavoritos"
          @change="atualizar({ favoritos: $event.target.checked })"
        />
        <label class="btn btn-outline-warning flex-fill" for="so-favoritos">
          <i class="bi bi-star-fill"></i> Favoritos
        </label>
        <button type="button" class="btn btn-outline-secondary" title="Limpar filtros" @click="limpar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { ESTADOS } from '../utils/estados'

export default {
  name: 'FiltroDeputados',
  emits: ['mudar-filtro'],
  props: {
    nome: String,
    uf: String,
    partido: String,
    soFavoritos: Boolean,
    partidos: { type: Array, default: () => [] }
  },
  data() {
    return {
      estados: ESTADOS,
      textoBusca: this.nome || '',
      temporizador: null
    }
  },
  watch: {
    // Mantém o campo sincronizado quando a URL muda (ex.: botão voltar)
    nome(valor) {
      if ((valor || '') !== this.textoBusca.trim()) this.textoBusca = valor || ''
    }
  },
  methods: {
    // Espera o usuário parar de digitar para não atualizar a URL a cada letra
    digitarNome() {
      clearTimeout(this.temporizador)
      this.temporizador = setTimeout(() => this.atualizar({ nome: this.textoBusca.trim() }), 400)
    },
    atualizar(mudanca) {
      this.$emit('mudar-filtro', mudanca)
    },
    limpar() {
      clearTimeout(this.temporizador)
      this.textoBusca = ''
      this.atualizar({ nome: '', uf: '', partido: '', favoritos: false })
    }
  },
  beforeUnmount() {
    clearTimeout(this.temporizador)
  }
}
</script>
