import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface AdminCredentials {
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export function getAdminCredentials(): AdminCredentials | null {
  try {
    const credentialsPath = path.join(process.cwd(), '.kiro', 'admin', 'credentials.json');
    
    if (!fs.existsSync(credentialsPath)) {
      return null;
    }

    const credentialsData = fs.readFileSync(credentialsPath, 'utf8');
    return JSON.parse(credentialsData);
  } catch (error) {
    console.error('Error reading admin credentials:', error);
    return null;
  }
}

export function validateAdminLogin(username: string, password: string): boolean {
  const credentials = getAdminCredentials();
  
  if (!credentials) {
    return false;
  }

  return credentials.username === username && 
         verifyPassword(password, credentials.passwordHash, credentials.salt);
}