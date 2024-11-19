const bcrypt = require('bcrypt');

async function generateAndTestHash() {
  try {
    // Gera a hash
    const password = '123456';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Generated Hash:', hash);
    
    // Testa a hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation test:', isValid);
    
    return hash;
  } catch (error) {
    console.error('Error:', error);
  }
}

generateAndTestHash();
