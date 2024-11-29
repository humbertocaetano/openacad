const { pool } = require('../config/database');

// Funções auxiliares
async function generateRegistrationNumber(client, yearId) {
  try {
    const yearResult = await client.query(
      'SELECT name FROM school_years WHERE id = $1',
      [yearId]
    );

    if (yearResult.rows.length === 0) {
      throw new Error('Ano escolar não encontrado');
    }

    const currentYear = new Date().getFullYear();
    const yearName = yearResult.rows[0].name;
    let levelCode, gradeNumber;
    
    const grade = parseInt(yearName.match(/\d+/)[0]);
    
    if (yearName.toLowerCase().includes('pré')) {
      levelCode = '00';
      gradeNumber = grade.toString().padStart(2, '0');
    } else if (grade <= 9) {
      levelCode = '01';
      gradeNumber = grade.toString().padStart(2, '0');
    } else {
      levelCode = '02';
      gradeNumber = (grade - 9).toString().padStart(2, '0');
    }

    const sequence = await generateUniqueSequence(client, currentYear, levelCode, gradeNumber);
    const registrationNumber = `${currentYear}${levelCode}${gradeNumber}${sequence}`;

    return registrationNumber;
  } catch (error) {
    console.error('Erro ao gerar matrícula:', error);
    throw error;
  }
}

async function generateUniqueSequence(client, year, level, grade) {
  let isUnique = false;
  let sequence;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isUnique && attempts < maxAttempts) {
    sequence = Math.floor(1000 + Math.random() * 9000).toString();
    const registrationNumber = `${year}${level}${grade}${sequence}`;
    const exists = await checkRegistrationExists(client, registrationNumber);
    
    if (!exists) {
      isUnique = true;
      return sequence;
    }
    
    attempts++;
  }
  
  throw new Error('Não foi possível gerar um número de matrícula único');
}

async function checkRegistrationExists(client, registration) {
  const result = await client.query(
    'SELECT EXISTS(SELECT 1 FROM students WHERE registration = $1)',
    [registration]
  );
  return result.rows[0].exists;
}

function generateUsername(fullName) {
  const names = fullName.toLowerCase().trim().split(' ');
  const firstName = names[0];
  const lastName = names[names.length - 1];
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${firstName}.${lastName}.${randomNum}`;
}

async function checkUsername(client, username) {
  const result = await client.query(
    'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)',
    [username]
  );
  return result.rows[0].exists;
}

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

// Controladores
const getStudents = async (req, res) => {
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
};

const getStudentById = async (req, res) => {
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
    if (student.birth_date) {
      student.birth_date = new Date(student.birth_date).toISOString().split('T')[0];
    }

    res.json(student);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ message: 'Erro ao buscar aluno' });
  }
};

const createStudent = async (req, res) => {
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

    const classResult = await client.query(
      'SELECT year_id FROM classes WHERE id = $1',
      [class_id]
    );

    if (classResult.rows.length === 0) {
      throw new Error('Turma não encontrada');
    }

    const registration = await generateRegistrationNumber(client, classResult.rows[0].year_id);
    const username = await generateUniqueUsername(client, name);

    const levelResult = await client.query(
      'SELECT id FROM user_levels WHERE name = $1',
      ['Aluno']
    );

    if (levelResult.rows.length === 0) {
      throw new Error('Nível "Aluno" não encontrado');
    }

    const levelId = levelResult.rows[0].id;

    const userResult = await client.query(`
      INSERT INTO users (name, username, email, phone, password_hash, level_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [name, username, email, phone || null, registration, levelId]);

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
};

const updateStudent = async (req, res) => {
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
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const studentResult = await client.query(
      'SELECT user_id FROM students WHERE id = $1',
      [id]
    );

    if (studentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    await client.query('DELETE FROM students WHERE id = $1', [id]);
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
};

const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        s.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        c.year_id,
        sy.name as class_year_name,
        cd.name as class_division_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      JOIN classes c ON s.class_id = c.id
      JOIN school_years sy ON c.year_id = sy.id
      JOIN class_divisions cd ON c.division_id = cd.id
      WHERE s.class_id = $1 AND s.active = true
      ORDER BY u.name
    `, [classId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar alunos da turma:', error);
    res.status(500).json({ message: 'Erro ao buscar alunos da turma' });
  }
};

const importStudentsToClass = async (req, res) => {
  const client = await pool.connect();
  try {
    const { classId } = req.params;
    await client.query('BEGIN');

    const classResult = await client.query(`
      SELECT c.year_id, c.active 
      FROM classes c 
      WHERE c.id = $1
    `, [classId]);
    
    if (classResult.rows.length === 0) {
      throw new Error('Turma não encontrada');
    }

    if (!classResult.rows[0].active) {
      throw new Error('Não é possível importar alunos para uma turma inativa');
    }

    const importQuery = `
      UPDATE students s
      SET class_id = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE (s.class_id IS NULL OR s.class_id IN (
        SELECT id FROM classes WHERE active = false
      ))
      AND s.active = true
      AND NOT EXISTS (
        SELECT 1 FROM students s2 
        WHERE s2.class_id = $1 
        AND s2.user_id = s.user_id
        AND s2.active = true
      )
      RETURNING s.id`;
    
    const importResult = await client.query(importQuery, [classId]);
    await client.query('COMMIT');

    const updatedStudents = await pool.query(`
      SELECT 
        s.*,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.class_id = $1 AND s.active = true
    `, [classId]);
    
    res.json({
      imported: importResult.rowCount,
      total: updatedStudents.rows.length,
      students: updatedStudents.rows
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao importar alunos:', error);
    res.status(500).json({ message: error.message || 'Erro ao importar alunos' });
  } finally {
    client.release();
  }
};

const removeStudentFromClass = async (req, res) => {
    const client = await pool.connect();
    try {
      const { classId, studentId } = req.params;
      await client.query('BEGIN');
  
      // Verificar se o aluno está na turma especificada
      const checkResult = await client.query(`
        SELECT id FROM students 
        WHERE id = $1 AND class_id = $2 AND active = true
      `, [studentId, classId]);
      
      if (checkResult.rows.length === 0) {
        throw new Error('Aluno não encontrado na turma especificada');
      }
  
      // Remover aluno da turma
      await client.query(`
        UPDATE students
        SET class_id = NULL,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND class_id = $2
      `, [studentId, classId]);
  
      await client.query('COMMIT');
      res.json({ message: 'Aluno removido da turma com sucesso' });
  
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao remover aluno da turma:', error);
      res.status(500).json({ message: error.message || 'Erro ao remover aluno da turma' });
    } finally {
      client.release();
    }
  };
  
  // Verificação de matrícula
  const checkRegistrationNumber = async (req, res) => {
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
  };
  
  module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    importStudentsToClass,
    removeStudentFromClass,
    checkRegistrationNumber
  };