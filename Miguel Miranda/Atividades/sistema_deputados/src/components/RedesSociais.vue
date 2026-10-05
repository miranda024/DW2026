<template>
  <div v-if="links.length" class="d-flex flex-wrap gap-2">
    <a
      v-for="link in links"
      :key="link.url"
      :href="link.url"
      target="_blank"
      rel="noopener"
      class="btn btn-outline-secondary btn-sm"
    >
      <i class="bi me-1" :class="link.icone"></i>{{ link.nome }}
    </a>
  </div>
  <p v-else class="text-muted mb-0">Nenhuma rede social cadastrada.</p>
</template>

<script>
const REDES = [
  { trecho: 'instagram', nome: 'Instagram', icone: 'bi-instagram' },
  { trecho: 'facebook', nome: 'Facebook', icone: 'bi-facebook' },
  { trecho: 'twitter', nome: 'X / Twitter', icone: 'bi-twitter-x' },
  { trecho: 'x.com', nome: 'X / Twitter', icone: 'bi-twitter-x' },
  { trecho: 'youtube', nome: 'YouTube', icone: 'bi-youtube' },
  { trecho: 'tiktok', nome: 'TikTok', icone: 'bi-tiktok' },
  { trecho: 'linkedin', nome: 'LinkedIn', icone: 'bi-linkedin' },
  { trecho: 'threads', nome: 'Threads', icone: 'bi-threads' }
]

export default {
  name: 'RedesSociais',
  props: {
    urls: { type: Array, default: () => [] },
    site: String
  },
  computed: {
    links() {
      const lista = this.urls.map((url) => {
        const rede = REDES.find((item) => url.toLowerCase().includes(item.trecho))
        return {
          url: this.corrigirUrl(url),
          nome: rede ? rede.nome : 'Link',
          icone: rede ? rede.icone : 'bi-link-45deg'
        }
      })
      if (this.site) {
        lista.push({ url: this.corrigirUrl(this.site), nome: 'Site oficial', icone: 'bi-globe' })
      }
      return lista
    }
  },
  methods: {
    // Alguns links da API vêm sem "https://"
    corrigirUrl(url) {
      return /^https?:\/\//i.test(url) ? url : `https://${url}`
    }
  }
}
</script>
