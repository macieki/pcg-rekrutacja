# Quick Start Commands

## Installation
```bash
npm install
```

## Development
```bash
npm run dev
```
Visit: http://localhost:3000

## Production Build
```bash
npm run build
npm run start
```

## Generate Static Site
```bash
npm run generate
```

## Test Credentials
- **Email:** any email (e.g., test@example.com)
- **Password:** any password (min 6 chars)
- **Captcha Answer:** 7

## Key Routes
- `/` - Landing page
- `/auth/register` - Register
- `/auth/login` - Login
- `/dashboard` - Dashboard
- `/programmes` - Browse programmes
- `/applications` - My applications
- `/faq` - FAQ
- `/messages` - Messages

## Auto-fill Test Data
- **PESEL:** 12345678901 (auto-fills: Jan Kowalski, 1995-05-15, Male)
- **Postal Codes:** 87-100, 00-001, 30-001, 80-001, 60-001
- **Captcha:** 7 (answer to 3 + 4)

## Complete Application Flow
1. Start at `/` → Click "Start Application"
2. Register at `/auth/register`
3. Browse programmes at `/programmes`
4. Click any programme → Click "Apply Now"
5. Fill personal data (3 steps)
6. Fill education data (3 steps)
7. Review and submit
8. View status in dashboard

That's it! 🎉
