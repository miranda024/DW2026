import { createRouter, createWebHistory } from 'vue-router'
import ListaDeputados from '../views/ListaDeputados.vue'
import DetalhesDeputado from '../views/DetalhesDeputado.vue'
import PaginaNaoEncontrada from '../views/PaginaNaoEncontrada.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'lista', component: ListaDeputados },
    { path: '/deputado/:id', name: 'detalhes', component: DetalhesDeputado, props: true },
    { path: '/:pathMatch(.*)*', name: 'nao-encontrada', component: PaginaNaoEncontrada }
  ],
  // Volta para a mesma posição da lista ao clicar em "voltar"
  scrollBehavior(to, from, posicaoSalva) {
    return posicaoSalva || { top: 0 }
  }
})

export default router
