<template>
  <section>
    <button class="btn btn-link texto-primario px-0 mb-3" @click="voltar">
      <i class="bi bi-arrow-left me-1"></i>Voltar para a lista
    </button>

    <carregando-spinner v-if="carregando" mensagem="Carregando dados do deputado..." />

    <div v-else-if="erro" class="alert alert-danger d-flex align-items-center justify-content-between">
      <span><i class="bi bi-exclamation-triangle-fill me-2"></i>{{ erro }}</span>
      <button class="btn btn-sm btn-outline-danger" @click="carregar">Tentar novamente</button>
    </div>

    <template v-else-if="deputado">
      <!-- Cabeçalho -->
      <div class="card shadow-sm mb-4 overflow-hidden">
        <div class="faixa"></div>
        <div class="card-body d-flex flex-column flex-md-row align-items-center gap-4">
          <img :src="status.urlFoto" :alt="`Foto de ${status.nome}`" class="rounded-circle foto shadow" />

          <div class="flex-grow-1 text-center text-md-start">
            <h1 class="h3 mb-1">{{ status.nomeEleitoral || status.nome }}</h1>
            <p class="text-muted mb-2">{{ deputado.nomeCivil }}</p>
            <span class="badge bg-success me-1">{{ status.siglaPartido }}</span>
            <span class="badge bg-secondary me-1">{{ status.siglaUf }}</span>
            <span class="badge" :class="emExercicio ? 'bg-primary' : 'bg-danger'">{{ status.situacao }}</span>
            <span v-if="status.condicaoEleitoral" class="badge bg-light text-dark border ms-1">
              {{ status.condicaoEleitoral }}
            </span>
          </div>

          <div class="d-flex flex-column gap-2">
            <button class="btn" :class="isFavorito ? 'btn-warning' : 'btn-outline-warning'" @click="favoritar">
              <i class="bi" :class="isFavorito ? 'bi-star-fill' : 'bi-star'"></i>
              {{ isFavorito ? 'Favorito' : 'Favoritar' }}
            </button>
            <a :href="`https://www.camara.leg.br/deputados/${id}`" target="_blank" rel="noopener" class="btn btn-outline-secondary">
              <i class="bi bi-box-arrow-up-right me-1"></i>Página na Câmara
            </a>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Gabinete -->
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white fw-semibold">
              <i class="bi bi-building me-2 texto-primario"></i>Gabinete
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
                <span class="text-muted"><i class="bi bi-envelope me-2"></i>E-mail</span>
                <span v-if="email" class="text-end text-break">
                  <a :href="`mailto:${email}`">{{ email }}</a>
                  <button class="btn btn-sm btn-link p-0 ms-2" title="Copiar e-mail" @click="copiarEmail">
                    <i class="bi" :class="emailCopiado ? 'bi-check2 text-success' : 'bi-clipboard'"></i>
                  </button>
                </span>
                <span v-else class="text-muted">Não informado</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted"><i class="bi bi-telephone me-2"></i>Telefone</span>
                <a v-if="gabinete.telefone" :href="`tel:+5561${somenteNumeros(gabinete.telefone)}`">
                  (61) {{ gabinete.telefone }}
                </a>
                <span v-else class="text-muted">Não informado</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted"><i class="bi bi-door-open me-2"></i>Sala</span>
                <span>{{ gabinete.sala || '—' }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted"><i class="bi bi-buildings me-2"></i>Prédio / Andar</span>
                <span>
                  {{ gabinete.predio ? `Anexo ${gabinete.predio}` : '—' }}
                  {{ gabinete.andar ? `· ${gabinete.andar}º andar` : '' }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Dados pessoais -->
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white fw-semibold">
              <i class="bi bi-person-vcard me-2 texto-primario"></i>Dados pessoais
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Nascimento</span>
                <span>{{ nascimento }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Naturalidade</span>
                <span>{{ naturalidade }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Escolaridade</span>
                <span>{{ deputado.escolaridade || '—' }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span class="text-muted">Sexo</span>
                <span>{{ deputado.sexo === 'F' ? 'Feminino' : deputado.sexo === 'M' ? 'Masculino' : '—' }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Redes sociais -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-white fw-semibold">
              <i class="bi bi-share me-2 texto-primario"></i>Redes sociais
            </div>
            <div class="card-body">
              <redes-sociais :urls="deputado.redeSocial" :site="deputado.urlWebsite" />
            </div>
          </div>
        </div>

        <!-- Comissões -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-white fw-semibold d-flex justify-content-between">
              <span><i class="bi bi-people me-2 texto-primario"></i>Comissões e órgãos atuais</span>
              <span class="badge bg-light text-dark border">{{ orgaos.length }}</span>
            </div>
            <ul v-if="orgaos.length" class="list-group list-group-flush">
              <li
                v-for="orgao in orgaos"
                :key="`${orgao.idOrgao}-${orgao.codTitulo}`"
                class="list-group-item d-flex justify-content-between align-items-center gap-2"
              >
                <span>
                  <span class="fw-semibold">{{ orgao.siglaOrgao }}</span>
                  <span class="text-muted"> · {{ orgao.nomePublicacao || orgao.nomeOrgao }}</span>
                </span>
                <span class="badge bg-success-subtle text-success-emphasis text-nowrap">{{ orgao.titulo }}</span>
              </li>
            </ul>
            <div v-else class="card-body text-muted">Nenhuma participação ativa encontrada.</div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script>
import CarregandoSpinner from '../components/CarregandoSpinner.vue'
import RedesSociais from '../components/RedesSociais.vue'
import { buscarDeputadoPorId, buscarOrgaos } from '../services/camaraApi'
import { alternarFavorito, lerFavoritos } from '../utils/favoritos'

export default {
  name: 'DetalhesDeputado',
  components: {
    CarregandoSpinner,
    RedesSociais
  },
  props: {
    id: { type: String, required: true }
  },
  data() {
    return {
      deputado: null,
      orgaos: [],
      favoritos: lerFavoritos(),
      carregando: true,
      erro: '',
      emailCopiado: false
    }
  },
  computed: {
    status() {
      return this.deputado.ultimoStatus
    },
    gabinete() {
      return this.status.gabinete || {}
    },
    email() {
      return this.gabinete.email || this.status.email
    },
    emExercicio() {
      return this.status.situacao === 'Exercício'
    },
    isFavorito() {
      return this.favoritos.includes(Number(this.id))
    },
    nascimento() {
      if (!this.deputado.dataNascimento) return '—'
      const [ano, mes, dia] = this.deputado.dataNascimento.split('-').map(Number)
      const hoje = new Date()
      let idade = hoje.getFullYear() - ano
      if (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) idade--
      const data = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`
      return `${data} (${idade} anos)`
    },
    naturalidade() {
      const { municipioNascimento, ufNascimento } = this.deputado
      if (!municipioNascimento) return '—'
      return ufNascimento ? `${municipioNascimento} - ${ufNascimento}` : municipioNascimento
    }
  },
  watch: {
    id() {
      this.carregar()
    }
  },
  mounted() {
    this.carregar()
  },
  methods: {
    async carregar() {
      this.carregando = true
      this.erro = ''
      try {
        // A lista de comissões é um extra: se falhar, a página continua funcionando
        const [deputado, orgaos] = await Promise.allSettled([
          buscarDeputadoPorId(this.id),
          buscarOrgaos(this.id)
        ])
        if (deputado.status === 'rejected') throw deputado.reason
        this.deputado = deputado.value
        this.orgaos = orgaos.status === 'fulfilled' ? orgaos.value : []
        document.title = `${this.status.nome} | Deputados Federais`
      } catch (error) {
        console.error('Erro ao carregar deputado: ', error)
        this.erro = error.response?.status === 404
          ? 'Deputado não encontrado.'
          : 'Não foi possível carregar os dados do deputado.'
      } finally {
        this.carregando = false
      }
    },
    voltar() {
      // Se veio da lista, volta mantendo a busca; se abriu o link direto, vai para a lista
      if (window.history.state?.back) this.$router.back()
      else this.$router.push({ name: 'lista' })
    },
    favoritar() {
      this.favoritos = alternarFavorito(Number(this.id))
    },
    async copiarEmail() {
      try {
        await navigator.clipboard.writeText(this.email)
        this.emailCopiado = true
        setTimeout(() => (this.emailCopiado = false), 2000)
      } catch {
        window.prompt('Copie o e-mail:', this.email)
      }
    },
    somenteNumeros(texto) {
      return texto.replace(/\D/g, '')
    }
  }
}
</script>

<style scoped>
.faixa {
  height: 80px;
  background: linear-gradient(90deg, var(--cor-primaria), #1f7a5a);
}

.foto {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 4px solid #fff;
  margin-top: -90px;
}

@media (min-width: 768px) {
  .foto {
    margin-top: -60px;
  }
}
</style>
