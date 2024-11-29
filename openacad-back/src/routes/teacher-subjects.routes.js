const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Buscar todas as disciplinas do professor
router.get('/', async (req, res) => {
  try {

    console.log('Buscando disciplinas...');

    const result = await pool.query(`
      SELECT 
        ts.id,
        ts.year,
        ts.teacher_id,
        ts.subject_id,
        ts.division_id,
        ts.active,
        s.name as subject_name,
        cd.name as class_division_name,
        sy.name as class_year_name
      FROM teacher_subjects ts
      INNER JOIN subjects s ON ts.subject_id = s.id
      LEFT JOIN class_divisions cd ON ts.division_id = cd.id
      INNER JOIN school_years sy ON s.year_id = sy.id
      WHERE ts.active = true
      ORDER BY sy.name, s.name, cd.name;
    `);

    console.log('Resultado da consulta:', result.rows);

    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas do professor:', error);
    res.status(500).json({ message: 'Erro ao buscar disciplinas do professor' });
  }
});

module.exports = router;