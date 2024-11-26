// src/controllers/teacherAllocation.controller.js
const { pool } = require('../config/database');

const createAllocation = async (req, res) => {
  const { teacherId, subjectId, year, schedules } = req.body;
  
  try {
    // Verificar se existe registro na tabela teachers para este usuário
    let teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [teacherId]
    );

    let teacher;
    if (teacherResult.rows.length === 0) {
      // Se não existe, cria um novo registro na tabela teachers
      const insertResult = await pool.query(
        'INSERT INTO teachers (user_id) VALUES ($1) RETURNING id',
        [teacherId]
      );
      teacher = insertResult.rows[0];
    } else {
      teacher = teacherResult.rows[0];
    }

    const existingAllocation = await pool.query(
      `SELECT ts.*, s.name as subject_name 
       FROM teacher_subjects ts
       JOIN subjects s ON ts.subject_id = s.id
       WHERE ts.teacher_id = $1 
       AND ts.subject_id = $2 
       AND ts.year = $3 
       AND ts.active = true`,
      [teacher.id, subjectId, year]
    );

    if (existingAllocation.rows.length > 0) {
      return res.status(400).json({
        error: `O professor já está alocado para a disciplina "${existingAllocation.rows[0].subject_name}" no ano ${year}`
      });
    }

    // Verificar conflitos de horário usando o ID correto do professor
    const conflicts = await checkTimeConflicts(teacher.id, schedules);
    if (conflicts.length > 0) {
      return res.status(400).json({
        error: 'Conflito de horário detectado',
        conflicts
      });
    }

    // Criar alocação usando o pool
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const teacherSubjectResult = await client.query(
        `INSERT INTO teacher_subjects 
         (teacher_id, subject_id, year, active) 
         VALUES ($1, $2, $3, true) 
         RETURNING *`,
        [teacher.id, subjectId, year]  // Usando o ID da tabela teachers
      );
      
      const teacherSubject = teacherSubjectResult.rows[0];

      if (schedules && schedules.length > 0) {
        for (const schedule of schedules) {
          await client.query(
            `INSERT INTO class_schedules 
             (teacher_subject_id, weekday, start_time, end_time) 
             VALUES ($1, $2, $3, $4)`,
            [teacherSubject.id, schedule.weekday, schedule.startTime, schedule.endTime]
          );
        }
      }

      await client.query('COMMIT');
      res.status(201).json(teacherSubject);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao criar alocação:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllocations = async (req, res) => {
  const { year } = req.query;
  
  try {
    const result = await pool.query(
      `SELECT 
        ts.id,
        ts.year,
        ts.active,
        t.id as teacher_id,
        t.user_id,
        u.name as teacher_name,
        s.id as subject_id,
        s.name as subject_name,
        sy.name as school_year_name,
        cd.name as division_name
      FROM teacher_subjects ts
      LEFT JOIN teachers t ON ts.teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN subjects s ON ts.subject_id = s.id
      LEFT JOIN school_years sy ON s.year_id = sy.id
      LEFT JOIN classes c ON s.year_id = c.year_id
      LEFT JOIN class_divisions cd ON c.division_id = cd.id
      WHERE ts.active = true
      ${year ? 'AND ts.year = $1' : ''}
      ORDER BY u.name, s.name`,
      year ? [year] : []
    );

    const allocations = await Promise.all(
      result.rows.map(async (row) => {
        const schedulesResult = await pool.query(
          'SELECT id, weekday, start_time, end_time FROM class_schedules WHERE teacher_subject_id = $1',
          [row.id]
        );

        // Formatar os horários
        const formattedSchedules = schedulesResult.rows.map(schedule => {
          const weekdays = {
            1: 'Segunda-feira',
            2: 'Terça-feira',
            3: 'Quarta-feira',
            4: 'Quinta-feira',
            5: 'Sexta-feira'
          };

          // Formatar horários (converter de HH:MM:SS para HH:MM)
          const startTime = schedule.start_time.substring(0, 5);
          const endTime = schedule.end_time.substring(0, 5);

          return {
            id: schedule.id,
            weekday: schedule.weekday,
            weekdayName: weekdays[schedule.weekday],
            startTime,
            endTime,
            displayText: `${weekdays[schedule.weekday]} - ${startTime} às ${endTime}`
          };
        });

        return {
          id: row.id,
          teacher: {
            id: row.user_id,
            name: row.teacher_name
          },
          subject: {
            id: row.subject_id,
            name: row.subject_name
          },
          class: {
            name: `${row.school_year_name || ''} ${row.division_name || ''}`.trim() || 'Não definida'
          },
          year: row.year,
          schedules: formattedSchedules
        };
      })
    );

    res.json(allocations);
  } catch (error) {
    console.error('Erro ao buscar alocações:', error);
    res.status(500).json({ error: error.message });
  }
};


const getAllocation = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
        ts.id,
        ts.year,
        ts.active,
        t.id as teacher_id,
        t.user_id,
        u.name as teacher_name,
        s.id as subject_id,
        s.name as subject_name
      FROM teacher_subjects ts
      LEFT JOIN teachers t ON ts.teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN subjects s ON ts.subject_id = s.id
      WHERE ts.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alocação não encontrada' });
    }

    const row = result.rows[0];
    const schedulesResult = await pool.query(
      'SELECT * FROM class_schedules WHERE teacher_subject_id = $1',
      [id]
    );

    const allocation = {
      id: row.id,
      teacher: {
        id: row.user_id,  // Usando user_id em vez de teacher_id
        name: row.teacher_name
      },
      subject: {
        id: row.subject_id,
        name: row.subject_name
      },
      year: row.year,
      schedules: schedulesResult.rows
    };

    res.json(allocation);
  } catch (error) {
    console.error('Erro ao buscar alocação:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateAllocation = async (req, res) => {
  const { id } = req.params;
  const { teacherId, subjectId, year, schedules } = req.body;
  
  try {
    // Verificar se existe registro na tabela teachers para este usuário
    let teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [teacherId]
    );

    let teacher;
    if (teacherResult.rows.length === 0) {
      const insertResult = await pool.query(
        'INSERT INTO teachers (user_id) VALUES ($1) RETURNING id',
        [teacherId]
      );
      teacher = insertResult.rows[0];
    } else {
      teacher = teacherResult.rows[0];
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Atualizar teacher_subjects
      const updateResult = await client.query(
        `UPDATE teacher_subjects 
         SET teacher_id = $1, subject_id = $2, year = $3
         WHERE id = $4
         RETURNING *`,
        [teacher.id, subjectId, year, id]
      );

      if (updateResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Alocação não encontrada' });
      }

      // Deletar schedules existentes
      await client.query(
        'DELETE FROM class_schedules WHERE teacher_subject_id = $1',
        [id]
      );

      // Inserir novos schedules
      if (schedules && schedules.length > 0) {
        for (const schedule of schedules) {
          await client.query(
            `INSERT INTO class_schedules 
             (teacher_subject_id, weekday, start_time, end_time)
             VALUES ($1, $2, $3, $4)`,
            [id, schedule.weekday, schedule.startTime, schedule.endTime]
          );
        }
      }

      await client.query('COMMIT');
      res.json(updateResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro ao atualizar alocação:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAllocation = async (req, res) => {
  const { id } = req.params;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deletar schedules primeiro (chave estrangeira)
    await client.query(
      'DELETE FROM class_schedules WHERE teacher_subject_id = $1',
      [id]
    );

    // Deletar allocation
    const result = await client.query(
      'DELETE FROM teacher_subjects WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Alocação não encontrada' });
    }

    await client.query('COMMIT');
    res.status(204).send();
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao deletar alocação:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

const getTeacherAllocations = async (req, res) => {
  const { teacherId } = req.params;
  
  try {
    // Primeiro, pegar o ID da tabela teachers
    const teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [teacherId]
    );

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    const teacher = teacherResult.rows[0];

    const result = await pool.query(
      `SELECT 
        ts.id,
        ts.year,
        ts.active,
        t.id as teacher_id,
        t.user_id,
        u.name as teacher_name,
        s.id as subject_id,
        s.name as subject_name
      FROM teacher_subjects ts
      LEFT JOIN teachers t ON ts.teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN subjects s ON ts.subject_id = s.id
      WHERE ts.teacher_id = $1 AND ts.active = true
      ORDER BY ts.year DESC, s.name`,
      [teacher.id]
    );

    const allocations = await Promise.all(
      result.rows.map(async (row) => {
        const schedulesResult = await pool.query(
          'SELECT * FROM class_schedules WHERE teacher_subject_id = $1',
          [row.id]
        );

        return {
          id: row.id,
          teacher: {
            id: row.user_id,  // Usando user_id em vez de teacher_id
            name: row.teacher_name
          },
          subject: {
            id: row.subject_id,
            name: row.subject_name
          },
          year: row.year,
          schedules: schedulesResult.rows
        };
      })
    );

    res.json(allocations);
  } catch (error) {
    console.error('Erro ao buscar alocações do professor:', error);
    res.status(500).json({ error: error.message });
  }
};

const checkTimeConflicts = async (teacherId, schedules) => {
  try {
    const conflicts = [];
    
    for (const schedule of schedules) {
      const result = await pool.query(
        `SELECT cs.*, s.name as subject_name
         FROM class_schedules cs
         JOIN teacher_subjects ts ON cs.teacher_subject_id = ts.id
         JOIN subjects s ON ts.subject_id = s.id
         WHERE ts.teacher_id = $1
         AND cs.weekday = $2
         AND (
           (cs.start_time, cs.end_time) OVERLAPS ($3::time, $4::time)
         )`,
        [teacherId, schedule.weekday, schedule.startTime, schedule.endTime]
      );

      conflicts.push(...result.rows);
    }

    return conflicts;
  } catch (error) {
    console.error('Erro ao verificar conflitos:', error);
    throw error;
  }
};

const checkAllocationConflicts = async (req, res) => {
  const { teacherId, schedules } = req.body;
  
  try {
    // Primeiro, pegar o ID da tabela teachers
    const teacherResult = await pool.query(
      'SELECT id FROM teachers WHERE user_id = $1',
      [teacherId]
    );

    if (teacherResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    const teacher = teacherResult.rows[0];
    const conflicts = await checkTimeConflicts(teacher.id, schedules);
    
    res.json({
      hasConflicts: conflicts.length > 0,
      conflicts
    });
  } catch (error) {
    console.error('Erro ao verificar conflitos:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAllocation,
  getAllocations,
  getAllocation,
  updateAllocation,
  deleteAllocation,
  getTeacherAllocations,
  checkAllocationConflicts,
  checkTimeConflicts
};
