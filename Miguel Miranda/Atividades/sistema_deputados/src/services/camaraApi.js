import axios from 'axios'

// As chamadas passam por um proxy (/api-camara -> dadosabertos.camara.leg.br/api/v2)
// porque a API da Câmara nem sempre envia o cabeçalho de CORS e o navegador bloqueia.
// O proxy está em vite.config.js (desenvolvimento), vercel.json e public/_redirects (produção).
const api = axios.create({
  baseURL: '/api-camara'
})

export async function buscarDeputados({ nome = '', uf = '', partido = '' } = {}) {
  const params = { ordem: 'ASC', ordenarPor: 'nome' }
  if (nome) params.nome = nome
  if (uf) params.siglaUf = uf
  if (partido) params.siglaPartido = partido

  const { data } = await api.get('/deputados', { params })
  return data.dados
}

export async function buscarDeputadoPorId(id) {
  const { data } = await api.get(`/deputados/${id}`)
  return data.dados
}

export async function buscarOrgaos(id) {
  const { data } = await api.get(`/deputados/${id}/orgaos`, {
    params: { ordem: 'DESC', ordenarPor: 'dataInicio', itens: 100 }
  })
  // Mantém apenas as participações que ainda estão ativas
  return data.dados.filter((orgao) => !orgao.dataFim)
}

export async function buscarPartidos() {
  const { data } = await api.get('/partidos', {
    params: { ordem: 'ASC', ordenarPor: 'sigla', itens: 100 }
  })
  return data.dados
}
