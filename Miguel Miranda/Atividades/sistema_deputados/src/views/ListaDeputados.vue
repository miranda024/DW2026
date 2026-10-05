<template>
  <section>
    <div class="mb-4">
      <h1 class="h3 texto-primario mb-1">Consulta de Deputados</h1>
      <p class="text-muted mb-0">
        Busque deputados federais em exercício pelo nome, estado ou partido. Clique em um card para ver os detalhes.
      </p>
    </div>

    <filtro-deputados
      :nome="filtros.nome"
      :uf="filtros.uf"
      :partido="filtros.partido"
      :so-favoritos="filtros.favoritos"
      :partidos="partidos"
      @mudar-filtro="mudarFiltro"
    />

    <carregando-spinner v-if="carregando" mensagem="Buscando deputados..." />

    <div v-else-if="erro" class="alert alert-danger d-flex align-items-center justify-content-between">
      <span><i class="bi bi-exclamation-triangle-fill me-2"></i>{{ erro }}</span>
      <button class="btn btn-sm btn-outline-danger" @click="carregarDeputados">Tentar novamente</button>
    </div>

    <div v-else-if="!deputadosFiltrados.length" class="text-center text-muted py-5">
      <i class="bi bi-person-x display-4 d-block mb-2"></i>
      <p v-if="filtros.favoritos && !favoritos.length" class="mb-0">
        Você ainda não favoritou nenhum deputado. Clique na estrela de um card para salvar.
      </p>
      <p v-else class="mb-0">Nenhum deputado encontrado com esses filtros.</p>
    </div>

    <div v-else class="row g-4">
      <div class="col-12 col-lg-9">
        <p class="text-muted small mb-3">
          {{ deputadosFiltrados.length }}
          {{ deputadosFiltrados.length === 1 ? 'deputado encontrado' : 'deputados encontrados' }}
        </p>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <div v-for="deputado in deputadosVisiveis" :key="deputado.id" class="col">
            <card-deputado
              :id="deputado.id"
              :foto="deputado.urlFoto"
              :nome="deputado.nome"
              :partido="deputado.siglaPartido"
              :uf="deputado.siglaUf"
              :is-favorito="favoritos.includes(deputado.id)"
              @alternar-favorito="lidarComFavorito"
            />
          </div>
        </div>

        <div v-if="quantidadeVisivel < deputadosFiltrados.length" class="text-center mt-4">
          <button class="btn btn-primaria" @click="quantidadeVisivel += POR_PAGINA">
            Carregar mais ({{ deputadosFiltrados.length - quantidadeVisivel }} restantes)
          </button>
        </div>
      </div>

      <aside class="col-12 col-lg-3">
        <resumo-partidos :deputados="deputadosFiltrados" />
      </aside>
    </div>
  </section>
</template>

<script>
import CardDeputado from '../components/CardDeputado.vue'
import CarregandoSpinner from '../components/CarregandoSpinner.vue'
import FiltroDeputados from '../components/FiltroDeputados.vue'
import ResumoPartidos from '../components/ResumoPartidos.vue'
import { buscarTodosDeputados } from '../services/camaraApi'
import { alternarFavorito, lerFavoritos } from '../utils/favoritos'

const POR_PAGINA = 24

// Deixa o texto em minúsculas e sem acentos, para "jose" encontrar "José"
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default {
  name: 'ListaDeputados',
  components: {
    CardDeputado,
    CarregandoSpinner,
    FiltroDeputados,
    ResumoPartidos
  },
  data() {
    return {
      POR_PAGINA,
      deputados: [],
      favoritos: lerFavoritos(),
      carregando: true,
      erro: '',
      quantidadeVisivel: POR_PAGINA
    }
  },
  computed: {
    // Os filtros ficam na URL (?nome=...&uf=...) para a busca sobreviver ao "voltar" e poder ser compartilhada
    filtros() {
      const query = this.$route.query
      return {
        nome: query.nome || '',
        uf: query.uf || '',
        partido: query.partido || '',
        favoritos: query.favoritos === '1'
      }
    },
    // Partidos que têm deputados em exercício, em ordem alfabética
    partidos() {
      const siglas = new Set(this.deputados.map((deputado) => deputado.siglaPartido))
      return [...siglas].sort()
    },
    deputadosFiltrados() {
      const { nome, uf, partido, favoritos } = this.filtros
      const busca = normalizar(nome)
      return this.deputados.filter((deputado) =>
        (!busca || normalizar(deputado.nome).includes(busca)) &&
        (!uf || deputado.siglaUf === uf) &&
        (!partido || deputado.siglaPartido === partido) &&
        (!favoritos || this.favoritos.includes(deputado.id))
      )
    },
    deputadosVisiveis() {
      return this.deputadosFiltrados.slice(0, this.quantidadeVisivel)
    }
  },
  watch: {
    // Ao mudar qualquer filtro, volta a mostrar só a primeira "página" de cards
    filtros() {
      this.quantidadeVisivel = POR_PAGINA
    }
  },
  mounted() {
    document.title = 'Deputados Federais'
    this.carregarDeputados()
  },
  methods: {
    async carregarDeputados() {
      this.carregando = true
      this.erro = ''
      try {
        this.deputados = await buscarTodosDeputados()
      } catch (error) {
        console.error('Erro na API de deputados: ', error)
        this.erro = 'A API da Câmara não respondeu. Tente novamente em alguns segundos.'
      } finally {
        this.carregando = false
      }
    },
    mudarFiltro(mudanca) {
      const novos = { ...this.filtros, ...mudanca }
      const query = {}
      if (novos.nome) query.nome = novos.nome
      if (novos.uf) query.uf = novos.uf
      if (novos.partido) query.partido = novos.partido
      if (novos.favoritos) query.favoritos = '1'
      this.$router.replace({ query })
    },
    lidarComFavorito(id) {
      this.favoritos = alternarFavorito(id)
    }
  }
}
</script>
