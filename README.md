# SkillBridge
A full-stack freelance marketplace built with React, TypeScript, Django REST Framework, and SQLite.

## Features
- JWT-based authentication for clients and freelancers
- Project marketplace with client-created listings
- Messaging between users
- Responsive dashboard and landing pages
- Demo seed data for quick local setup

## Local development

### Backend
```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Demo accounts
The seed command creates demo users and sample projects:
- client@example.com / password123
- freelancer@example.com / password123

## Testing
```bash
cd backend
python manage.py test

cd ../frontend
npm test
npm run build
```

## CI
The project includes a GitHub Actions workflow that runs backend tests and frontend build checks on push and pull requests.

## Notes
- The app uses SQLite by default for local development.
- Update the secret key and environment variables in a production deployment.
