const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { config } = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const { setupDatabase } = require('./config/database');
const teacherSubjectsRouter = require('./routes/teacher-subjects.routes');

const { 
  authRouter, 
  userRouter, 
  teacherAllocationRouter,
  lessonContentsRouter 
} = require('./routes');

const userLevelsRouter = require('./routes/user-levels.routes');
const classesRouter = require('./routes/classes.routes');
const subjectsRouter = require('./routes/subjects.routes');
const studentsRouter = require('./routes/students.routes');
const teachersRouter = require('./routes/teachers.routes');

config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:4200', 
    'http://192.168.15.104:4200', 
    'http://35.166.228.126:4200', 
    'http://www.openacad.com.br:4200'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('\n--- Nova Requisição ---');
  console.log(`Data/Hora: ${new Date().toISOString()}`);
  console.log(`Método: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);  
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter); 
app.use('/api/user-levels', userLevelsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/allocations', teacherAllocationRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/lesson-contents', lessonContentsRouter);
app.use('/api/teacher-subjects', teacherSubjectsRouter);

app.use((req, res, next) => {
  console.log('\nURL completa:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('Path:', req.path);
  next();
});


app.use('*', (req, res, next) => {
  console.log('Rota não encontrada:', req.originalUrl);
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

app.use(errorHandler);

setupDatabase();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
