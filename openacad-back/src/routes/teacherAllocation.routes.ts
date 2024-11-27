import express from 'express';
import { createAllocation, getTeacherAllocations, checkAllocationConflicts, deleteAllocation } 
  from '../controllers/teacherAllocation.controller';

const router = express.Router();

router.post('/allocations', createAllocation);
router.get('/allocations/teacher/:teacherId', getTeacherAllocations);
router.get('/allocations/conflicts', checkAllocationConflicts);
router.delete('/allocations/:id', deleteAllocation);


export default router;
