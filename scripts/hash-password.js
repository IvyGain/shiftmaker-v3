const bcrypt = require('bcryptjs');

// パスワードをハッシュ化するスクリプト
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(`Original: ${password}`);
  console.log(`Hashed: ${hashedPassword}`);
  return hashedPassword;
}

// 使用例
const passwords = ['admin123', 'employee123'];

passwords.forEach(async (password) => {
  await hashPassword(password);
  console.log('---');
});