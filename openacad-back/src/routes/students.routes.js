const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/students.controller');

// Listagem de todos os alunos
router.get('/', studentsController.getStudents);

// Rota de verificação de matrícula
router.get('/check-registration/:registration([0-9]+)', studentsController.checkRegistrationNumber);

// Rotas para gerenciamento de alunos em turmas
router.get('/class/:classId', studentsController.getStudentsByClass);
router.post('/class/:classId/import', studentsController.importStudentsToClass);
router.delete('/class/:classId/student/:studentId', studentsController.removeStudentFromClass);

// CRUD básico
router.get('/:id([0-9]+)', studentsController.getStudentById);
router.post('/', studentsController.createStudent);
router.put('/:id', studentsController.updateStudent);
router.delete('/:id', studentsController.deleteStudent);

module.exports = router;
