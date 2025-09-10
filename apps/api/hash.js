import bcrypt from 'bcrypt';
const hashed = await bcrypt.hash('newpassword123', 10);
console.log(hashed);
