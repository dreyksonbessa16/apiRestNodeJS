const mysql = require("../mysql").pool;

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error });}
    conn.query(
      `SELECT pedidos.id_pedidos,
                  pedidos.quantidade,
                  produtos.id_produto,
                  produtos.nome,
                  produtos.preco
          FROM pedidos
          INNER JOIN produtos
          ON pedidos.id_produto = produtos.id_produto;`,
      (error, result, fields) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error });}
        const response = {
          quantidade: result.length,
          pedidos: result.map((pedido) => {
            return {
              id_pedido: pedido.id_pedidos,
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: pedido.preco,
              },
              request: {
                tipo: "GET",
                descricao: "Retorna os dados de um pedido específico",
                url: process.env.URL_API + "pedidos/" + pedido.id_pedidos,
              },
            };
          }),
        };
        return res.status(200).send({ response });
      }
    );
  });
};

exports.postPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error });}
    conn.query(
      "SELECT * FROM produtos WHERE id_produto = ? ;",
      [req.body.id_produto],
      (error, result, fields) => {
        if (error) {return res.status(500).send({ error: error });}
        if (result.length == 0) {return res.status(404).send({ mensagem: "Não foi encontrado produto com este ID" })}
        conn.query(
          "INSERT INTO pedidos (id_produto, quantidade) VALUES ( ? , ? );",
          [req.body.id_produto, req.body.quantidade],
          (error, result, fields) => {
            conn.release();
            if (error) {return res.status(500).send({ error: error });}
            const response = {
              mensagem: "Pedido inserido",
              pedidoCriado: {
                id_pedido: result.id_pedidos,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                  tipo: "GET",
                  descricao: "Retorna todos os pedidos",
                  url: process.env.URL_API + "pedidos/",
                },
              },
            };
            return res.status(200).send({ response });
          }
        );
      }
    );
  });
};

exports.getPedidosIdPedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error });}
    conn.query(
      "SELECT * FROM pedidos WHERE id_pedidos = ? ;",
      [req.params.id_pedidos],
      (error, result, fields) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error });}
        if (result.length == 0) {return res.status(404).send({ mensagem: "Não foi encontrado produto com este ID" })}
        const response = {
          pedido: {
            id_pedido: result[0].id_pedidos,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os pedidos",
              url: process.env.URL_API + "pedidos/",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
};

exports.deletePedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error });}
    conn.query(
      `DELETE FROM pedidos WHERE id_pedidos = ?`,
      [req.body.id_pedido],
      (error, result, fields) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error });}
        const response = {
          mensagem: "Produro removido com sucesso ",
          request: {
            tipo: "POST",
            descricao: "Insere um pedido",
            url: process.env.URL_API + "pedidos/",
            body: {
              id_produto: "number",
              quantidade: "number",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
};
