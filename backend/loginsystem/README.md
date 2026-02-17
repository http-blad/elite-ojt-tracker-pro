# Elite OJT Tracker Pro (Backend)

Laravel 11 API for the Elite OJT Tracker Pro platform. This service handles authentication, OTP verification, password resets, and system audit logs using Laravel Sanctum with session-based auth.

**Tech**
1. Laravel 11 + PHP 8.2
2. Laravel Sanctum (session auth)
3. MySQL
4. Vite + Tailwind (optional asset pipeline)

**Quickstart**
1. Install PHP and Composer dependencies.
2. Configure the environment.
3. Run migrations and start the server.

```bash
composer install
copy .env.example .env
php artisan key:generate
```

Update database credentials in `.env` then run:

```bash
php artisan migrate
php artisan db:seed
```

Start the API:

```bash
php artisan serve
```

The API runs on `http://localhost:8000` by default.

**Required Environment**
1. `DB_*` credentials for MySQL in `.env`.
2. `APP_URL` should match your backend URL (default `http://localhost:8000`).
3. `FRONTEND_URL` is used for password reset redirects. If it is missing, the default is `http://localhost:3000`.
4. `MAIL_*` settings control OTP and reset email delivery. The default `MAIL_MAILER=log` writes emails to the log.

**Session Table**
`SESSION_DRIVER` is set to `database` in `.env.example`. If you keep that setting, create the sessions table once:

```bash
php artisan session:table
php artisan migrate
```

**API Endpoints**
Base URL: `/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/ping` | Health check |
| POST | `/login` | Password login |
| POST | `/request-otp` | Request OTP |
| POST | `/login-otp` | Login with OTP |
| POST | `/forgot-password` | Send reset link |
| POST | `/reset-password` | Reset password |
| POST | `/register` | Register user |
| GET | `/user` | Current user (auth) |
| POST | `/logout` | Logout (auth) |
| GET | `/system-logs` | System logs (SUPERADMIN) |

**Auth Notes**
1. This API uses cookie-based sessions with CSRF protection.
2. The frontend must call `/sanctum/csrf-cookie` before the first POST request.

**Troubleshooting**
1. If you get `419` errors, confirm cookies are enabled and the frontend is using the same backend base URL.
2. If email delivery fails, set real `MAIL_*` SMTP settings or check the log file.
3. If you see database errors, confirm migrations ran against the configured database.
