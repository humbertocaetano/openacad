const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Funções auxiliares para geração da matrícula
async function generateRegistrationNumber(client, yearId) {
  try {
    // Primeiro, buscar informações do ano escolar
    const yearResult = await client.query(
      'SELECT name FROM school_years WHERE id = $1',
      [yearId]
    );

    if (yearResult.rows.length === 0) {
      throw new Error('Ano escolar não encontrado');
    }

    // Obter o ano atual
    const currentYear = new Date().getFullYear();
    
    // Determinar o nível e série baseado no nome do ano escolar
    const yearName = yearResult.rows[0].name;
    let levelCode, gradeNumber;
    
    // Extrair o número do ano escolar (assumindo formato "1º Ano", "2º Ano", etc.)
    const grade = parseInt(yearName.match(/\d+/)[0]);
    
    if (yearName.toLowerCase().includes('pré')) {
      levelCode = '00';
      gradeNumber = grade.toString().padStart(2, '0');
    } else if (grade <= 9) {
      levelCode = '01'; // Fundamental
      gradeNumber = grade.toString().padStart(2, '0');
    } else {
      levelCode = '02'; // Médio
      gradeNumber = (grade - 9).toString().padStart(2, '0'); // 10º ano = 01, 11º = 02, 12º = 03
    }

    // Gerar sequência aleatória de 4 dígitos
    async function generateUniqueSequence() {
      let isUnique = false;
      let sequence;
      let attempts = 0;
      const maxAttempts = 100;

      while (!isUnique && attempts < maxAttempts) {
        sequence = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Verificar se a matrícula já existe
        const registrationNumber = `${currentYear}${levelCode}${gradeNumber}${sequence}`;
        const exists = await checkRegistrationExists(client, registrationNumber);
        
        if (!exists) {
          isUnique = true;
          return sequence;
        }
        
        attempts++;
      }
      
      throw new Error('Não foi possível gerar um número de matrícula único');
    }

    const sequence = await generateUniqueSequence();
    
    // Formato final: AAAANNSSXXXX
    // AAAA = Ano atual
    // NN = Código do nível (00=Pré, 01=Fund, 02=Médio)
    // SS = Série com dois dígitos
    // XXXX = Sequência aleatória
    const registrationNumber = `${currentYear}${levelCode}${gradeNumber}${sequence}`;
    
    console.log('Matrícula gerada:', {
      ano: currentYear,
      nivel: levelCode,
      serie: gradeNumber,
      sequencia: sequence,
      matriculaCompleta: registrationNumber
    });

    return registrationNumber;
  } catch (error) {
    console.error('Erro ao gerar matrícula:', error);
    throw error;
  }
}


// Função auxiliar para verificar se a matrícula já existe
async function checkRegistrationExists(client, registration) {
  const result = await client.query(
    'SELECT EXISTS(SELECT 1 FROM students WHERE registration = $1)',
    [registration]
  );
  return result.rows[0].exists;
}


// Função auxiliar para gerar username
function generateUsername(fullName) {
  // Pega o primeiro e último nome
  const names = fullName.toLowerCase().trim().split(' ');
  const firstName = names[0];
  const lastName = names[names.length - 1];
  
  // Gera número aleatório de 4 dígitos
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  // Retorna o username no formato especificado
  return `${firstName}.${lastName}.${randomNum}`;
}

// Função para verificar se o username já existe
async function checkUsername(client, username) {
  const result = await client.query(
    'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)',
    [username]
  );
  return result.rows[0].exists;
}

// Função para gerar username único
async function generateUniqueUsername(client, fullName) {
  let username;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10;

  while (exists && attempts < maxAttempts) {
    username = generateUsername(fullName);
    exists = await checkUsername(client, username);
    attempts++;
  }

  if (attempts === maxAttempts) {
    throw new Error('Não foi possível gerar um username único');
  }

  return username;
}

// Rota de listagem (PRIMEIRO)
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

// Rota de teste (SEGUNDO)
router.get('/test', (req, res) => {
    res.json({ message: 'Rota de teste funcionando' });
});

// Rota de verificação de matrícula (TERCEIRO)
router.get('/check-registration/:registration([0-9]+)', async (req, res) => {
  const { registration } = req.params;
  console.log('Verificando matrícula:', registration);

  try {
    const result = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM students WHERE registration = $1) as exists',
      [registration]
    );
    res.json({ exists: result.rows[0].exists });
  } catch (error) {
    console.error('Erro ao verificar matrícula:', error);
    res.status(500).json({ message: 'Erro ao verificar matrícula' });
  }
});

// Rota para obter um aluno específico (ÚLTIMO)
router.get('/:id([0-9]+)', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        c.id as class_id,
        c.year_id as year_id
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    const student = result.rows[0];
    // Formatar a data de nascimento para YYYY-MM-DD se existir
    if (student.birth_date) {
      student.birth_date = new Date(student.birth_date).toISOString().split('T')[0];
    }

    res.json(student);


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

    // Primeiro, precisamos pegar o year_id da classe
    const classResult = await client.query(
      'SELECT year_id FROM classes WHERE id = $1',
      [class_id]
    );

    if (classResult.rows.length === 0) {
      throw new Error('Turma não encontrada');
    }

    // Gerar matrícula
    const registration = await generateRegistrationNumber(client, classResult.rows[0].year_id);

    // Gerar username único
    const username = await generateUniqueUsername(client, name);
    console.log('Username gerado:', username);

    const levelResult = await client.query(
      'SELECT id FROM user_levels WHERE name = $1',
      ['Aluno']
    );

    if (levelResult.rows.length === 0) {
      throw new Error('Nível "Aluno" não encontrado');
    }

    const levelId = levelResult.rows[0].id;


    // Criar usuário primeiro
    const userResult = await client.query(`
      INSERT INTO users (name, username, email, phone, password_hash, level_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [name, username, email, phone || null, registration, levelId]); // Usando a matrícula como senha inicial

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
    
    if (error.message === 'Nível "Aluno" não encontrado') {
      res.status(400).json({ message: 'Nível "Aluno" não está cadastrado no sistema' });
    } else if (error.code === '23505') {
      if (error.constraint === 'students_registration_key') {
        res.status(400).json({ message: 'Matrícula já existe' });
      } else {
        res.status(400).json({ message: 'Dados duplicados encontrados' });
      }
    } else {
      res.status(500).json({ 
        message: 'Erro ao criar aluno',
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
