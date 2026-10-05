// Favoritos ficam salvos no navegador (localStorage)
const CHAVE = 'deputados-favoritos'

export function lerFavoritos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || []
  } catch {
    return []
  }
}

export function salvarFavoritos(ids) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(ids))
  } catch {
    // Navegador sem localStorage: favoritos valem só nesta sessão
  }
}

export function alternarFavorito(id) {
  const favoritos = lerFavoritos()
  const novos = favoritos.includes(id)
    ? favoritos.filter((fav) => fav !== id)
    : [...favoritos, id]
  salvarFavoritos(novos)
  return novos
}
