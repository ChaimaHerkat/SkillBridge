# 🌉 SkillBridge

> A modern full-stack freelance marketplace that connects clients with skilled freelancers through projects, profiles, and communication.

SkillBridge is a full-stack web application designed to simplify the connection between clients looking for digital services and freelancers offering their skills.

The platform provides dedicated experiences for clients and freelancers, with authentication, project management, profiles, communication, and a modern responsive interface.


--------------------------------------------------------------------------

⏩ Quick Links
🎯 About SkillBridge
✨ Features
🔄 How SkillBridge Works
🏗️ Architecture
🛠️ Technologies
📁 Project Structure
📸 Screenshots
⚙️ Setup
🔐 Environment Variables
🧪 Testing
🔄 CI/CD
🔌 API Overview
🗺️ Future Improvements
👩‍💻 Author
📄 License


----------------------------------------------------------------


## 🎯 About SkillBridge

SkillBridge is a freelance marketplace designed to bring **clients and freelancers together in one platform**.

The application allows users to create accounts, manage their profiles, publish and discover projects, and communicate with other users.

The project was developed as a full-stack application using a modern frontend architecture with **React and TypeScript** and a RESTful backend powered by **Django REST Framework**.

The main goals of SkillBridge are:

* Connect clients with qualified freelancers.
* Simplify project discovery and management.
* Provide a clear and intuitive user experience.
* Separate frontend and backend responsibilities.
* Implement secure authentication and authorization.
* Provide a scalable foundation for future marketplace features.

-----------------------------------------


## ✨ Features

### 👤 Client

Clients can:

* Create an account.
* Authenticate securely.
* Manage their profile.
* Discover freelancers.
* Create and manage projects.
* Communicate with freelancers.
* Access their personalized dashboard.

### 💼 Freelancer

Freelancers can:

* Create an account.
* Authenticate securely.
* Create and manage their professional profile.
* Showcase their skills.
* Discover available projects.
* Interact with clients.
* Manage their freelance activities through their dashboard.

### 🔐 Authentication

SkillBridge includes an authentication system supporting:

* User registration.
* User login.
* Authentication state management.
* Protected application areas.
* User roles and permissions.

### 📂 Project Management

The project management system provides the foundation for:

* Creating projects.
* Viewing project information.
* Managing project-related data.
* Connecting clients with freelancers.

### 💬 Communication

SkillBridge includes a dedicated communication architecture allowing users to interact around their projects.

The backend contains dedicated messaging functionality while the frontend provides the corresponding application structure.

### 📊 Dashboard

Users have access to a dedicated dashboard experience adapted to their role.

The dashboard provides a central place to access relevant information and platform functionality.

---

## 🔄 How SkillBridge Works

### 👤 Client Workflow

```text
Create an account
       ↓
Complete profile
       ↓
Discover freelancers
       ↓
Create or manage a project
       ↓
Connect with freelancers
       ↓
Communicate
       ↓
Manage project activities
```

### 💼 Freelancer Workflow

```text
Create an account
       ↓
Complete professional profile
       ↓
Add skills and information
       ↓
Discover projects
       ↓
Connect with clients
       ↓
Communicate
       ↓
Work on projects
```

---

## 🏗️ Architecture

SkillBridge follows a **separated full-stack architecture**.

```text
┌───────────────────────────────────────┐
│              Frontend                 │
│                                       │
│       React + TypeScript + Vite       │
│                                       │
│  Pages • Components • Context • Hooks │
│  Services • Routes • Types • Styles   │
└───────────────────┬───────────────────┘
                    │
                    │ HTTP / REST API
                    ▼
┌───────────────────────────────────────┐
│               Backend                 │
│                                       │
│       Django + Django REST Framework  │
│                                       │
│ Accounts • Projects • Messaging       │
│ Authentication • API • Permissions    │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│              Database                 │
│                  SQLite               │
└───────────────────────────────────────┘
```

### Frontend

The frontend is responsible for:

* User interface.
* Navigation and routing.
* Authentication state.
* API communication.
* Reusable components.
* User dashboards.
* Forms and interactions.

### Backend

The backend is responsible for:

* Business logic.
* Authentication.
* Authorization.
* Data validation.
* REST API endpoints.
* User management.
* Projects.
* Messaging.
* Database operations.

---

## 🛠️ Technologies

### Frontend

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| **React**        | User interface                |
| **TypeScript**   | Type-safe development         |
| **Vite**         | Development and build tooling |
| **React Router** | Application routing           |
| **CSS**          | Interface styling             |

### Backend

| Technology                | Purpose                      |
| ------------------------- | ---------------------------- |
| **Python**                | Backend programming language |
| **Django**                | Web framework                |
| **Django REST Framework** | REST API development         |
| **django-cors-headers**   | Cross-origin requests        |
| **python-dotenv**         | Environment configuration    |

### Database

| Technology | Purpose              |
| ---------- | -------------------- |
| **SQLite** | Development database |

### Testing & Quality

| Technology         | Purpose                |
| ------------------ | ---------------------- |
| **Django Tests**   | Backend testing        |
| **Vitest**         | Frontend testing       |
| **GitHub Actions** | Continuous integration |

### Development Tools

* Git
* GitHub
* Visual Studio Code
* npm
* Python virtual environments

---

## 📁 Project Structure

```text
SkillBridge/
│
├── backend/
│   │
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── management/
│   │   ├── authentication.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── messages/
│   │
│   ├── messaging/
│   │
│   ├── projects/
│   │
│   ├── tests/
│   │
│   └── config/
│       ├── settings.py
│       ├── urls.py
│       └── ...
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── test/
│   │   └── types/
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── vitest.config.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── README.md
└── ...
```

---

## 📸 Screenshots

### 🏠 Home Page

The SkillBridge landing page introduces the platform and provides access to its main functionalities.
[📸 View Home Page Screenshot](screenshots/Home.png)

### 🔐 Authentication

The authentication interface allows users to securely access the platform.

🔐 Login — The login interface allows users to securely access their SkillBridge account.
[📸 View Login Page Screenshot](screenshots/log-in.png)

📝 Registration — The registration interface allows new users to create a SkillBridge account.
[📸 View Register Page Screenshot](screenshots/register.png)


### 📊 Client Dashboard

The client dashboard provides access to client-specific functionality.
[📸 View Client Dashboard Page Screenshot](screenshots/client-dashboard.png)

### 💼 Freelancer Dashboard

The freelancer dashboard provides access to professional activities and projects.
[📸 View Freelancer Dashboard Page Screenshot](screenshots/freelancer-dashboard.png)

### 📂 Projects

The project area allows users to interact with project-related information.


### 💬 Messaging

The messaging interface provides communication between users.

---

## ⚙️ Setup

### 📋 Prerequisites

Before running SkillBridge locally, make sure you have installed:

* Python 3.13+
* Node.js
* npm
* Git

You can verify your installations with:

```bash
python --version
node --version
npm --version
git --version
```

---

## 🔧 Backend Setup

Clone the repository:

```bash
git clone https://github.com/ChaimaHerkat/SkillBridge.git
```

Navigate to the project:

```bash
cd SkillBridge
```

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

If a requirements file is not available, install the required packages:

```bash
pip install django djangorestframework django-cors-headers python-dotenv
```

Run migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will normally be available at:

```text
http://127.0.0.1:8000/
```

---

## 💻 Frontend Setup

Open a second terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

## 🔐 Environment Variables

Sensitive configuration should be stored in environment variables rather than committed to Git.

Create a `.env` file inside the backend directory:

```text
backend/
└── .env
```

Example:

```env
SECRET_KEY=your-secret-key
DEBUG=True
```

> Never commit real API keys, passwords, tokens, or production secrets to GitHub.

For development, a `.env.example` file can be used as a template:

```env
SECRET_KEY=
DEBUG=True
```

---

## 🧪 Testing

SkillBridge contains testing infrastructure for both the backend and frontend.

### Backend Tests

From the `backend` directory:

```bash
python manage.py test
```

### Frontend Tests

From the `frontend` directory:

```bash
npm run test
```

For a production build:

```bash
npm run build
```

Testing should be extended as new features are added to the application.

---

## 🔄 CI/CD

SkillBridge uses **GitHub Actions** to automate project checks.

The CI workflow is located at:

```text
.github/workflows/ci.yml
```

The workflow is designed to automatically verify important parts of the application when changes are pushed or pull requests are created.

Typical checks include:

```text
Push / Pull Request
        ↓
GitHub Actions
        ↓
Backend checks
        ↓
Frontend checks
        ↓
Build / Tests
        ↓
Status
```

This helps detect problems before changes are merged into the project.

---

## 🔌 API Overview

The backend exposes REST API endpoints consumed by the React frontend.

The API is organized around the main application domains, including:

```text
Authentication
     │
     ├── Accounts
     │
     ├── Projects
     │
     └── Messaging
```

The frontend communicates with the backend through dedicated service/API modules rather than directly coupling UI components to backend implementation details.

---

## 🔒 Security Considerations

SkillBridge follows several basic security practices:

* Sensitive configuration is stored using environment variables.
* Authentication is handled by the backend.
* API permissions are handled server-side.
* CORS configuration is used for frontend/backend communication.
* Local development files should not be committed to Git.

The following files/directories should remain excluded from version control:

```text
.env
venv/
.venv/
__pycache__/
node_modules/
db.sqlite3
```

---

## 🗺️ Future Improvements

The current architecture provides a foundation for extending SkillBridge into a more complete freelance marketplace.

Possible future improvements include:

* ⭐ Reviews and ratings.
* 💳 Online payment integration.
* 🔔 Real-time notifications.
* 🔎 Advanced freelancer and project search.
* 📨 Improved real-time messaging.
* 📊 Advanced analytics dashboards.
* 📱 Mobile application.
* ☁️ Cloud deployment.
* 🐘 PostgreSQL for production.
* 🐳 Docker-based deployment.
* 🔐 Additional authentication providers.
* 📈 Improved monitoring and logging.

> These features are planned improvements and are not necessarily part of the current implementation.

---

## 🚀 Roadmap

```text
[x] Project foundation
[x] React + TypeScript frontend
[x] Django backend
[x] REST API foundation
[x] Authentication foundation
[x] Client/Freelancer structure
[x] Project structure
[x] Messaging architecture
[x] Testing infrastructure
[x] GitHub Actions / CI

[ ] Production deployment
[ ] PostgreSQL
[ ] Advanced search
[ ] Reviews & ratings
[ ] Notifications
[ ] Online payments
[ ] Mobile application
```

> The roadmap should be updated as features are implemented.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

To contribute:

```bash
git clone https://github.com/ChaimaHerkat/SkillBridge.git
cd SkillBridge
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them, and submit a pull request.

---

## 👩‍💻 Author

**Chaima Herkat**

Master 2 — Bioinformatics

SkillBridge was developed as a full-stack software engineering project combining modern frontend development, backend API development, authentication, testing, and version control.

---

## 📄 License

This project is currently intended as an educational and portfolio project.

If a specific open-source license is added to the repository, this section should be updated accordingly.

---

## ⭐ Acknowledgements

Built with:

* React
* TypeScript
* Django
* Django REST Framework
* Vite
* GitHub Actions

---

<p align="center">
  Built with ❤️ by <strong>Chaima Herkat</strong>
</p>
