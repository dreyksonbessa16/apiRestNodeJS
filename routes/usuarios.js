const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuarios-controller');


router.post('/cadastro', UsuariosController.getCadastro);
router.post('/login', UsuariosController.getLogin);

module.exports = router;