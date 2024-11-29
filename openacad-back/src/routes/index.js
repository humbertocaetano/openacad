const authRouter = require('./auth.routes');
const userRouter = require('./users.routes');
const teacherAllocationRouter = require('./teacherAllocation.routes');
const lessonContentsRouter = require('./lesson-contents.routes');

module.exports = {
  authRouter,
  userRouter,
  teacherAllocationRouter,
  lessonContentsRouter
};
