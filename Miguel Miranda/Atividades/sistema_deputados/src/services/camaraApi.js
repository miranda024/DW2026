import axios from 'axios'

// As chamadas passam por um proxy (/api-camara -> dadosabertos.camara.leg.br/api/v2)
// porque a API da Câmara nem sempre envia o cabeçalho de CORS e o navegador bloqueia.
// O proxy está em vite.config.js (desenvolvimento), vercel.json e public/_redirects (produção).
const api = axios.create({
  baseURL: '/api-camara',
  timeout: 20000
})

// A API da Câmara às vezes demora demais e responde com erro 504.
// Quando isso acontece (ou falha a rede), tenta de novo até 2 vezes antes de desistir.
const MAX_TENTATIVAS = 2

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro) => {
    const config = erro.config
    const status = erro.response?.status
    const podeTentarDeNovo = !status || status >= 500

    if (!config || !podeTentarDeNovo || (config.tentativas || 0) >= MAX_TENTATIVAS) {
      throw erro
    }

    config.tentativas = (config.tentativas || 0) + 1
    await new Promise((resolve) => setTimeout(resolve, 1000 * config.tentativas))
    return api(config)
  }
)

// A lista completa (513 deputados) é buscada uma única vez e guardada em memória.
// Os filtros de nome, UF e partido são aplicados no navegador, sem novas chamadas à API.
let listaEmCache = null

export function buscarTodosDeputados() {
  if (!listaEmCache) {
    listaEmCache = api
      .get('/deputados', { params: { ordem: 'ASC', ordenarPor: 'nome' } })
      .then(({ data }) => data.dados)
      .catch((erro) => {
        listaEmCache = null // permite tentar de novo no botão "Tentar novamente"
        throw erro
      })
  }
  return listaEmCache
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
