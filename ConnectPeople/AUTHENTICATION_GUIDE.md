# TeaTalk Connect - Authentication & Data Storage Guide

## Data Storage Location

### Database File
- **Location**: `d:\VibeCoding2025\ConnectPeople\server\database.sqlite`
- **Type**: SQLite (file-based database)
- **Automatically created**: When the server starts for the first time

### Data Stored

#### Users Table
```
- id (auto-generated)
- name
- email (unique)
- passwordHash (bcrypt encrypted)
- avatarUrl
- anonymous (boolean)
- isEmailVerified (boolean)
- emailVerificationToken (temporary)
- emailVerificationTokenExpiry (24 hours)
- createdAt (timestamp)
- updatedAt (timestamp)
```

#### Discussion Topics Table
```
- id
- title
- category (Tea, Restaurant, Park, Bar)
- tags (comma-separated)
- creatorId (foreign key to User)
- createdAt
- updatedAt
```

#### Chat Messages Table
```
- id
- content
- topicId (foreign key to Topic)
- authorId (foreign key to User)
- createdAt
```

## Authentication Flow

### 1. Sign Up Process
```
User enters: Name, Email, Password
  ↓
System validates email uniqueness
  ↓
Password hashed using bcryptjs
  ↓
User record created with unverified status
  ↓
Verification email sent with unique token
  ↓
User clicks verification link in email
  ↓
Email marked as verified, user can login
```

### 2. Email Verification
- Verification token sent via email
- Token expires in 24 hours
- User clicks email link to verify
- Token validated and email marked as verified
- User redirected to login page

### 3. Login Process
```
User enters: Email, Password
  ↓
System finds user by email
  ↓
Checks if email is verified
  ↓
Validates password against hash
  ↓
Generates JWT token (valid for 7 days)
  ↓
Token stored in localStorage
  ↓
User logged in and redirected to app
```

### 4. Session Management
- JWT token stored in `localStorage` as `tt_token`
- User data stored in `localStorage` as `tt_user` (JSON)
- Token automatically added to all API requests
- Token expires after 7 days

## Setting Up Email Service

### Step 1: Configure Gmail (or other SMTP)

For Gmail:
1. Enable 2-Factor Authentication
2. Generate "App Password" at https://myaccount.google.com/apppasswords
3. Copy the 16-character password

### Step 2: Update `.env` file
Edit `d:\VibeCoding2025\ConnectPeople\server\.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:3000
PORT=4000
```

### Alternative Email Providers
- **Outlook**: `smtp.office365.com` (port 587)
- **SendGrid**: Use SendGrid API instead
- **Mailgun**: Use Mailgun API instead

## Running the Application

### Terminal 1 - Start Backend
```powershell
d:\VibeCoding2025\ConnectPeople\server\run-server.bat
```
Server runs on: `http://localhost:4000`

### Terminal 2 - Start Frontend
```powershell
d:\VibeCoding2025\ConnectPeople\client\run-client.bat
```
App runs on: `http://localhost:3000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Create new account
  ```json
  { "name": "John", "email": "john@example.com", "password": "pass123" }
  ```

- `POST /api/auth/login` - Login user
  ```json
  { "email": "john@example.com", "password": "pass123" }
  ```

- `POST /api/auth/verify-email` - Verify email
  ```json
  { "token": "verification_token_from_email" }
  ```

## Security Features

1. **Password Hashing**: bcryptjs (10 salt rounds)
2. **JWT Tokens**: Secure session management
3. **Email Verification**: Prevents fake email registrations
4. **Token Expiration**: 
   - Verification tokens: 24 hours
   - JWT tokens: 7 days
5. **HTTPS Ready**: Can be deployed with SSL certificates
6. **CORS Enabled**: Controlled cross-origin access

## Troubleshooting

### Email Not Sending
- Check `.env` file configuration
- Verify Gmail App Password is correct
- Check "Less secure app access" settings
- Look at server console for error messages

### Login Fails
- Ensure email is verified first
- Check password is correct
- Verify user exists in database

### Database Issues
- Delete `database.sqlite` to reset database
- Server will recreate it on restart
- All users will be cleared

## Next Steps

1. Set up email service (see "Setting Up Email Service" above)
2. Test signup flow
3. Test email verification
4. Test login flow
5. Create topics and chat as authenticated user
6. Deploy to production with proper SSL/TLS
