#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function hashPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupAdmin() {
  console.log('🔐 Admin Credentials Setup\n');
  
  try {
    const username = await question('Enter admin username: ');
    if (!username.trim()) {
      console.log('❌ Username cannot be empty');
      process.exit(1);
    }

    const password = await question('Enter admin password: ');
    if (!password.trim() || password.length < 8) {
      console.log('❌ Password must be at least 8 characters long');
      process.exit(1);
    }

    const confirmPassword = await question('Confirm admin password: ');
    if (password !== confirmPassword) {
      console.log('❌ Passwords do not match');
      process.exit(1);
    }

    console.log('\n🔄 Generating secure credentials...');
    
    const { salt, hash } = hashPassword(password);
    
    const credentials = {
      username,
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString()
    };

    // Ensure the directory exists
    const credentialsDir = path.join(process.cwd(), '.kiro', 'admin');
    if (!fs.existsSync(credentialsDir)) {
      fs.mkdirSync(credentialsDir, { recursive: true });
    }

    const credentialsPath = path.join(credentialsDir, 'credentials.json');
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));

    // Update .gitignore to ensure credentials are not committed
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    if (!gitignoreContent.includes('.kiro/admin/credentials.json')) {
      gitignoreContent += '\n# Admin credentials\n.kiro/admin/credentials.json\n';
      fs.writeFileSync(gitignorePath, gitignoreContent);
    }

    console.log('✅ Admin credentials have been set up successfully!');
    console.log(`📁 Credentials stored in: ${credentialsPath}`);
    console.log('🔒 Password has been securely hashed');
    console.log('📝 .gitignore updated to exclude credentials file');
    
  } catch (error) {
    console.error('❌ Error setting up admin credentials:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupAdmin();