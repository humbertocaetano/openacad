// src/services/users.service.js
const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, username, email, phone, user_level FROM users ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

userRouter.post('/', async (req, res) => {
  const { name, username, email, phone, userLevel, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, username, email, phone, user_level, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, username, email, phone, userLevel, passwordHash]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  authRouter: router,
  userRouter
};

