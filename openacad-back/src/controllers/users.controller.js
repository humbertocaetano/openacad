// src/controllers/users.controller.js
const { pool } = require('../config/database');

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, username, email, phone, user_level FROM users ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

const createUser = async (req, res) => {
  // Implementar criação de usuário
};

const updateUser = async (req, res) => {
  // Implementar atualização de usuário
};

const deleteUser = async (req, res) => {
  // Implementar exclusão de usuário
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};

