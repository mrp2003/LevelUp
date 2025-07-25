# Admin Credentials Setup

This application uses a secure admin authentication system with hashed passwords.

## Initial Setup

1. **Run the setup script** to create your admin credentials:
   ```bash
   node scripts/setup-admin.js
   ```

2. **Follow the prompts** to enter:
   - Admin username
   - Admin password (minimum 8 characters)
   - Password confirmation

## Security Features

- **Password Hashing**: Passwords are hashed using PBKDF2 with SHA-512
- **Salt Generation**: Each password gets a unique random salt
- **Secure Storage**: Credentials are stored in `.kiro/admin/credentials.json`
- **Git Protection**: The credentials file is automatically added to `.gitignore`
- **Server-side Validation**: Authentication happens on the server, not in the browser

## Usage

- **First Time**: Run the setup script to create credentials
- **Update Credentials**: Run the setup script again to overwrite existing credentials
- **Login**: Use the admin login page with your configured username and password

## File Structure

```
.kiro/
└── admin/
    └── credentials.json  # Hashed credentials (auto-generated)
scripts/
└── setup-admin.js       # Setup script
src/
├── lib/
│   └── auth.ts          # Authentication utilities
└── app/
    └── api/
        └── admin/
            └── login/
                └── route.ts  # Secure login API
```

## Important Notes

- Never commit the `credentials.json` file to version control
- The setup script can be run multiple times to update credentials
- Passwords are never stored in plain text
- The system uses industry-standard security practices

## Troubleshooting

If you can't log in:
1. Ensure you've run the setup script: `node scripts/setup-admin.js`
2. Check that `.kiro/admin/credentials.json` exists
3. Verify your username and password are correct
4. Check the browser console for any error messages