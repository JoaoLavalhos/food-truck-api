const { produtos, pedidos } = require('./database')

const STATUS_VALIDOS = ['Pendente', 'Em Preparo', 'Entregue']

const pedidoStatus = {
  Pendente: ['Em Preparo', 'Entregue'],
  'Em Preparo': ['Entregue'],
  Entregue: [],
}

function criarErro(mensagem, statusCode = 400) {
  const erro = new Error(mensagem)
  erro.statusCode = statusCode
  return erro
}

function arredondar(valor) {
  return Number(valor.toFixed(2))
}

function validarNome(nomeCliente) {
  if (typeof nomeCliente !== 'string' || nomeCliente.trim() === '') {
    throw criarErro('O campo "nomeCliente" deve ser preenchida com uma string.')
  }
}

function validarIds(idsProdutos) {
  if (!Array.isArray(idsProdutos) || idsProdutos.length === 0) {
    throw criarErro('O campo "idsProdutos" deve ser um array que contenha pelo menos um ID.')
  }

  const idsInvalidos = idsProdutos.filter(
    (idProduto) => !Number.isInteger(idProduto) || idProduto <= 0,
  )

  if (idsInvalidos.length > 0) {
    throw criarErro('Todos os IDs de produtos devem ser numeros positivos do tipo inteiro.')
  }
}

function validarId(idPedido) {
  if (!Number.isInteger(idPedido) || idPedido <= 0) {
    throw criarErro('O ID do pedido deve ser um numero positivo do tipo inteiro.')
  }
}

function acharPedido(idPedido) {
  validarId(idPedido)

  const pedido = pedidos.find((item) => item.id === idPedido)

  if (!pedido) {
    throw criarErro('Pedido nao encontrado.', 404)
  }

  return pedido
}

function acharProdutos(idsProdutos) {
  const itens = idsProdutos.map((idProduto) => {
    const produto = produtos.find((item) => item.id === idProduto)

    if (!produto) {
      throw criarErro(`Produto com ID ${idProduto} nao encontrado.`)
    }

    return {
      id: produto.id,
      nome: produto.nome,
      precoUnitario: produto.preco,
    }
  })

  return itens
}

function calcularTotal(itens) {
  const total = itens.reduce((acumulador, item) => acumulador + item.precoUnitario, 0)
  return arredondar(total)
}

function gerarId() {
  if (pedidos.length === 0) {
    return 1
  }

  const maiorId = pedidos.reduce((acumulador, pedido) => {
    return pedido.id > acumulador ? pedido.id : acumulador
  }, 0)

  return maiorId + 1
}

function listarProdutos() {
  return produtos
}

function listarPedidos() {
  return pedidos
}

function buscarPedido(idPedido) {
  return acharPedido(idPedido)
}

function criarPedido(nomeCliente, idsProdutos) {
  validarNome(nomeCliente)
  validarIds(idsProdutos)

  const itens = acharProdutos(idsProdutos)
  const total = calcularTotal(itens)

  const novoPedido = {
    id: gerarId(),
    nomeCliente: nomeCliente.trim(),
    idsProdutos: [...idsProdutos],
    itens,
    status: 'Pendente',
    total,
  }

  pedidos.push(novoPedido)

  return novoPedido
}

function atualizarStatus(idPedido, novoStatus) {
  const pedido = acharPedido(idPedido)

  if (typeof novoStatus !== 'string' || novoStatus.trim() === '') {
    throw criarErro('O campo "status" deve ser preenchida com uma string.')
  }

  const statusNormalizado = novoStatus.trim()

  if (!STATUS_VALIDOS.includes(statusNormalizado)) {
    throw criarErro(`Status invalido. Use: ${STATUS_VALIDOS.join(', ')}.`)
  }

  if (pedido.status === 'Entregue') {
    throw criarErro('Esse pedido ja foi entregue ao cliente e nao pode mais ser mudado.')
  }

  if (pedido.status === statusNormalizado) {
    return pedido
  }

  const transicoesPermitidas = pedidoStatus[pedido.status]

  if (!transicoesPermitidas.includes(statusNormalizado)) {
    throw criarErro(
      `Nao podera ser alterado o status de "${pedido.status}" para "${statusNormalizado}".`,
    )
  }

  pedido.status = statusNormalizado
  return pedido
}

function excluirPedido(idPedido) {
  validarId(idPedido)

  const indicePedido = pedidos.findIndex((pedido) => pedido.id === idPedido)

  if (indicePedido === -1) {
    throw criarErro('Pedido nao encontrado.', 404)
  }

  const pedido = pedidos[indicePedido]

  if (pedido.status === 'Em Preparo' || pedido.status === 'Entregue') {
    throw criarErro(
      `O pedido ${pedido.id} nao pode ser deletado porque possui o status "${pedido.status}".`,
    )
  }

  pedidos.splice(indicePedido, 1)

  return {
    mensagem: 'Pedido removido com sucesso.',
    pedidoRemovido: pedido,
  }
}

module.exports = {
  listarProdutos,
  listarPedidos,
  buscarPedido,
  criarPedido,
  atualizarStatus,
  excluirPedido,
}
