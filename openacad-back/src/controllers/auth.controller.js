// src/controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const login = async (req, res) => {
  const { email, password, schoolCode } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT u.*, s.code as school_code FROM users u JOIN schools s ON u.school_id = s.id WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = userResult.rows[0];

    if (user.school_code !== schoolCode) {
      return res.status(401).json({ message: 'Código da escola inválido' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, userLevel: user.user_level },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: {
      id: user.id,
      name: user.name,
      email: user.email,
      userLevel: user.user_level
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

const register = async (req, res) => {
  // Implementar registro
};

module.exports = {
  login,
  register
};


