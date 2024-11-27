// src/routes/teacherAllocation.routes.js
const express = require('express');
const router = express.Router();
const {
  createAllocation,
  getAllocations,
  getAllocation,
  updateAllocation,
  deleteAllocation,
  getTeacherAllocations,
  checkAllocationConflicts
} = require('../controllers/teacherAllocation.controller');

// Rota para buscar alocações
router.get('/', getAllocations);  // Note que aqui é apenas '/'
router.post('/', createAllocation);
router.get('/:id', getAllocation);
router.put('/:id', updateAllocation);
router.delete('/:id', deleteAllocation);

// Rotas específicas
router.get('/teacher/:teacherId', getTeacherAllocations);
router.get('/check-conflicts', checkAllocationConflicts);

module.exports = router;
