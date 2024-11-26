// src/routes/index.js
const authRouter = require('./auth.routes');
const userRouter = require('./users.routes');
const teacherAllocationRouter = require('./teacherAllocation.routes');

module.exports = {
  authRouter,
  userRouter,
  teacherAllocationRouter
};
