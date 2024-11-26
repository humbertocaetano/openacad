// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { config } = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const { setupDatabase } = require('./config/database');

// Importar todas as rotas do arquivo index
const { 
  authRouter, 
  userRouter, 
  teacherAllocationRouter 
} = require('./routes');

// Importar outras rotas diretamente
const userLevelsRouter = require('./routes/user-levels.routes');
const classesRouter = require('./routes/classes.routes');
const subjectsRouter = require('./routes/subjects.routes');
const studentsRouter = require('./routes/students.routes');
const teachersRouter = require('./routes/teachers.routes');

// Load environment variables
config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:4200', 'http://192.168.15.104:4200'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
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

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter); // Removido usersRouter duplicado
app.use('/api/user-levels', userLevelsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/allocations', teacherAllocationRouter);
app.use('/api/teachers', teachersRouter);

app.use((req, res, next) => {
  console.log('\nURL completa:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('Path:', req.path);
  console.log('Route Stack:', app._router.stack.map(r => r.route?.path || r.name).filter(Boolean));
  next();
});


// 404 Handler
app.use('*', (req, res, next) => {
  console.log('Rota não encontrada:', req.originalUrl);
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API está funcionando!' });
});

// Error handling
app.use(errorHandler);

// Database setup
setupDatabase();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
