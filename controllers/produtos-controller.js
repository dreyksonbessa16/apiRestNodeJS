const mysql = require("../mysql").pool;

exports.getProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query("SELECT * FROM produtos;", (error, result, fields) => {
      conn.release();
      if (error) {return res.status(500).send({ error: error })}
      const response = {
        quantidade: result.length,
        produtos: result.map((prod) => {
          return {
            id_produto: prod.id_produto,
            nome: prod.nome,
            preco: prod.preco,
            imagem: prod.imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna os dados de um produto específico",
              url: "http://localhost:3000/produtos/" + prod.id_produto,
            },
          };
        }),
      };
      return res.status(200).send({ response });
    });
  });
};

exports.postProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query(
      "INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?);",
      [req.body.nome, req.body.preco, req.file.path],
      (error, result, field) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error })}
        const response = {
          mensagem: "Produro Inserido",
          produtoCriado: {
            nome: req.body.nome,
            preco: req.body.preco,
            imagem: req.file.path,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3000/produtos",
            },
          },
        };
        return res.status(201).send({ response });
      }
    );
  });
};

exports.getProdutosIdProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query(
      "SELECT * FROM produtos WHERE id_produto = ? ;",
      [req.params.id_produto],
      (error, result, fields) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error })}
        if (result.length == 0) {return res.status(404).send({mensagem: "Não foi encontrado produto com este ID" });}
        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome: result[0].nome,
            preco: result[0].preco,
            request: {
              tipo: "GET",
              descricao: "Retorna um produto",
              url: "http://localhost:3000/produtos/" + result.id_produto,
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
};

exports.patchProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query(
      `UPDATE produtos
                SET nome = ?,
                    preco = ?
                WHERE id_produto = ?`,
      [req.body.nome, req.body.preco, req.body.id_produto],
      (error, result, fields) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error })}
        const response = {
          mensagem: "Produro atualizado ",
          produtoCriado: {
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: "GET",
              descricao: "Retorna os dados de um produto específico",
              url: "http://localhost:3000/produtos/" + req.body.id_produto,
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
};

exports.deleteProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {return res.status(500).send({ error: error })}
    conn.query(
      `DELETE FROM produtos WHERE id_produto = ?`,
      [req.body.id_produto],
      (error, result, fields) => {
        conn.release();
        if (error) {return res.status(500).send({ error: error })}

        const response = {
          mensagem: "Produro removido com sucesso ",
          request: {
            tipo: "POST",
            descricao: "Insere um produto",
            url: "http://localhost:3000/produtos/",
            body: {
              nome: "string",
              preco: "number",
            },
          },
        };
        return res.status(200).send({ response });
      }
    );
  });
};
