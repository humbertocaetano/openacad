// src/index.js
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users.routes');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { config } = require('dotenv');
const { authRouter, userRouter } = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { setupDatabase } = require('./config/database');

const userLevelsRouter = require('./routes/user-levels.routes');
const classesRouter = require('./routes/classes.routes');
const subjectsRouter = require('./routes/subjects.routes');
const studentsRouter = require('./routes/students.routes');

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
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
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
app.use('/api/users', userRouter);

app.use('/api/user-levels', userLevelsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/students', subjectsRouter);

console.log('\n=== Rotas Registradas ===');
app.use('*', (req, res, next) => {
  console.log('Rota não encontrada: AQUI', req.originalUrl);
  next();
});

// Rota de teste
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


