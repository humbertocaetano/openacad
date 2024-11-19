const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

router.post('/login', async (req, res) => {
  const { email, password, schoolCode } = req.body;
  
  console.log('Login attempt for:', email);

  try {
    const userResult = await pool.query(
      `SELECT 
        u.*,
        s.code as school_code
       FROM users u
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE u.email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const user = userResult.rows[0];
    
    console.log('Found user:', {
      id: user.id,
      email: user.email,
      passwordHashLength: user.password_hash ? user.password_hash.length : 0,
      schoolCode: user.school_code
    });

    console.log('Attempting password validation...');
    console.log('Received password length:', password.length);
    console.log('Stored hash:', user.password_hash);

    try {
      const validPassword = await bcrypt.compare(password, user.password_hash);
      console.log('Password validation result:', validPassword);

      if (!validPassword) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Email ou senha inválidos' });
      }
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      return res.status(500).json({ message: 'Erro na validação da senha' });
    }

    if (!user.school_code || schoolCode !== user.school_code) {
      console.log('Invalid school code');
      return res.status(401).json({ message: 'Código da escola inválido' });
    }

    const token = jwt.sign(
      { userId: user.id, userLevel: user.user_level },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful');
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userLevel: user.user_level
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
