# Food Truck API

API REST acadêmica para gerenciamento de produtos e pedidos de um food truck.

## Tecnologias

- Node.js
- Express
- JavaScript
- Postman

## Funcionalidades

- listar produtos;
- listar pedidos;
- consultar pedido por ID;
- criar pedidos;
- atualizar status de pedidos;
- excluir pedidos;
- tratamento centralizado de erros.

## Rotas principais

```text
GET    /produtos
GET    /pedidos
GET    /pedidos/:id
POST   /pedidos
PATCH  /pedidos/:id/status
DELETE /pedidos/:id
```

## Como executar

```bash
npm install
npm start
```

Por padrão, a API utiliza a porta `3000`.

O repositório também inclui uma coleção do Postman usada para testar os endpoints durante a atividade.
