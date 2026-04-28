const express = require('express')
const pedidoService = require('./pedidoService')

const app = express()

app.use(express.json())

app.get('/', (_req, res) => {
  res.type('text/plain').send('API do Food Truck rodando.')
})

app.get('/produtos', (_req, res) => {
  res.json(pedidoService.listarProdutos())
})

app.get('/pedidos', (_req, res) => {
  res.json(pedidoService.listarPedidos())
})

app.get('/pedidos/:id', (req, res) => {
  const idPedido = Number(req.params.id)
  const pedido = pedidoService.buscarPedido(idPedido)
  res.json(pedido)
})

app.post('/pedidos', (req, res) => {
  const { nomeCliente, idsProdutos } = req.body
  const novoPedido = pedidoService.criarPedido(nomeCliente, idsProdutos)
  res.status(201).json(novoPedido)
})

app.patch('/pedidos/:id/status', (req, res) => {
  const idPedido = Number(req.params.id)
  const { status } = req.body
  const pedidoAtualizado = pedidoService.atualizarStatus(idPedido, status)
  res.json(pedidoAtualizado)
})

app.delete('/pedidos/:id', (req, res) => {
  const idPedido = Number(req.params.id)
  const resultado = pedidoService.excluirPedido(idPedido)
  res.json(resultado)
})

app.use((erro, _req, res, _next) => {
  const statusCode = erro.statusCode || 500
  const mensagem =
    statusCode === 500 ? 'Erro interno do servidor.' : erro.message

  res.status(statusCode).json({ erro: mensagem })
})

const PORT = process.env.PORT || 3000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  })
}

module.exports = app
