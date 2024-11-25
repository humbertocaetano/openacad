const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Verificação de matrícula - DEVE SER A PRIMEIRA ROTA
router.get('/check-registration/:registration', (req, res) => {
    console.log('Rota de verificação de matrícula acessada');
    console.log('Parâmetros:', req.params);
    
    const { registration } = req.params;
    
    pool.query(
        'SELECT EXISTS(SELECT 1 FROM students WHERE registration = $1) as exists',
        [registration]
    )
    .then(result => {
        console.log('Resultado da query:', result.rows[0]);
        res.json({ exists: result.rows[0].exists });
    })
    .catch(error => {
        console.error('Erro ao verificar matrícula:', error);
        res.status(500).json({ message: 'Erro ao verificar matrícula' });
    });
});

router.get('/test', (req, res) => {
    res.json({ message: 'Rota de teste funcionando' });
});

// Listar todos os alunos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        u.name as user_name,
        u.email as user_email,
        sy.name as class_year_name,
        cd.name as class_division_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      JOIN school_years sy ON c.year_id = sy.id
      JOIN class_divisions cd ON c.division_id = cd.id
      ORDER BY u.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro ao buscar alunos' });
  }
});

// Buscar aluno por ID
router.get('/:id([0-9]+)', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        u.name as user_name,
        u.email as user_email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ message: 'Erro ao buscar aluno' });
  }
});


// Criar aluno
router.post('/', async (req, res) => {
  const {
    name,
    email,
    registration,
    phone,
    class_id,
    birth_date,
    guardian_name,
    guardian_phone,
    guardian_email,
    address,
    health_info,
    notes,
    active
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Criar usuário primeiro
    const userResult = await client.query(`
      INSERT INTO users (name, email, phone, password_hash, user_level)
      VALUES ($1, $2, $3, $4, 'Aluno')
      RETURNING id
    `, [name, email, phone || null, registration]); // Usando a matrícula como senha inicial

    // Criar registro do aluno
    const studentResult = await client.query(`
      INSERT INTO students (
        registration, user_id, class_id, birth_date,
        guardian_name, guardian_phone, guardian_email,
        address, health_info, notes, active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      registration,
      userResult.rows[0].id,
      class_id,
      birth_date || null,
      guardian_name || null,
      guardian_phone || null,
      guardian_email || null,
      address || null,
      health_info || null,
      notes || null,
      active !== false
    ]);

    await client.query('COMMIT');
    res.status(201).json(studentResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar aluno:', error);
    
    if (error.code === '23505') {
      res.status(400).json({ message: 'Matrícula já existe' });
    } else {
      res.status(500).json({ message: 'Erro ao criar aluno' });
    }
  } finally {
    client.release();
  }
});

// Atualizar aluno
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    class_id,
    birth_date,
    guardian_name,
    guardian_phone,
    guardian_email,
    address,
    health_info,
    notes,
    active,
    user_data
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Atualizar dados do aluno
    const studentResult = await client.query(`
      UPDATE students
      SET class_id = $1,
          birth_date = $2,
          guardian_name = $3,
          guardian_phone = $4,
          guardian_email = $5,
          address = $6,
          health_info = $7,
          notes = $8,
          active = $9,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      class_id,
      birth_date || null,
      guardian_name || null,
      guardian_phone || null,
      guardian_email || null,
      address || null,
      health_info || null,
      notes || null,
      active,
      id
    ]);

    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Se houver dados do usuário para atualizar
    if (user_data) {
      await client.query(`
        UPDATE users
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone)
        WHERE id = $4
      `, [user_data.name, user_data.email, user_data.phone, studentResult.rows[0].user_id]);
    }

    await client.query('COMMIT');
    res.json(studentResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ message: 'Erro ao atualizar aluno' });
  } finally {
    client.release();
  }
});

// Excluir aluno
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Buscar o user_id do aluno
    const studentResult = await client.query(
      'SELECT user_id FROM students WHERE id = $1',
      [id]
    );

    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Excluir o registro do aluno
    await client.query('DELETE FROM students WHERE id = $1', [id]);

    // Excluir o usuário associado
    await client.query('DELETE FROM users WHERE id = $1', [studentResult.rows[0].user_id]);

    await client.query('COMMIT');
    res.json({ message: 'Aluno excluído com sucesso' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao excluir aluno:', error);
    res.status(500).json({ message: 'Erro ao excluir aluno' });
  } finally {
    client.release();
  }
});

module.exports = router;
