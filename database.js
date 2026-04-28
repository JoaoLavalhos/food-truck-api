const produtos = Object.freeze([
  Object.freeze({ id: 1, nome: 'Bug Burger', preco: 35.0 }),
  Object.freeze({ id: 2, nome: 'Fritas StackTrace', preco: 18.0 }),
  Object.freeze({ id: 3, nome: 'Soda Script', preco: 8.0 }),
])

const pedidos = []

module.exports = {
  produtos,
  pedidos,
}
