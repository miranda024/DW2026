<template>
  <div class="card shadow-sm">
    <div class="card-header bg-white">
      <span class="fw-semibold"><i class="bi bi-bar-chart-fill me-2 texto-primario"></i>Deputados por partido</span>
      <div class="small text-muted">no resultado atual</div>
    </div>
    <ul class="list-group list-group-flush">
      <li v-for="item in ranking" :key="item.sigla" class="list-group-item">
        <div class="d-flex justify-content-between small mb-1">
          <span class="fw-semibold">{{ item.sigla }}</span>
          <span class="text-muted">{{ item.total }}</span>
        </div>
        <div class="progress" style="height: 6px">
          <div class="progress-bar bg-success" :style="{ width: `${(item.total / maior) * 100}%` }"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ResumoPartidos',
  props: {
    deputados: { type: Array, required: true },
    limite: { type: Number, default: 8 }
  },
  computed: {
    ranking() {
      const contagem = {}
      for (const deputado of this.deputados) {
        contagem[deputado.siglaPartido] = (contagem[deputado.siglaPartido] || 0) + 1
      }
      return Object.entries(contagem)
        .map(([sigla, total]) => ({ sigla, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, this.limite)
    },
    maior() {
      return this.ranking.length ? this.ranking[0].total : 1
    }
  }
}
</script>
