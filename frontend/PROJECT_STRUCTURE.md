# SkillBridge Frontend Structure

## Project Organization

The frontend is organized following modern React best practices with a clear separation of concerns:

### 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Marketplace/    # Marketplace-related components
│   ├── Profile/        # Profile components
│   ├── Client/         # Client dashboard components
│   ├── Freelancer/     # Freelancer dashboard components
│   ├── Messages/       # Messaging components
│   ├── Notifications/  # Notification components
│   ├── Admin/          # Admin panel components
│   └── Common/         # Shared components (Navbar, Footer, etc.)
│
├── pages/              # Full page components
│   ├── Home.tsx
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Marketplace/
│   ├── Profile/
│   ├── Client/
│   ├── Freelancer/
│   ├── Admin/
│   ├── Messages.tsx
│   └── NotFound.tsx
│
├── layouts/            # Page layout wrappers
│   ├── MainLayout.tsx
│   └── DashboardLayout.tsx
│
├── services/           # API service layer
│   ├── api.ts          # Base API call handler
│   ├── authService.ts
│   ├── projectService.ts
│   ├── freelancerService.ts
│   └── messageService.ts
│
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   └── useProjects.ts
│
├── context/            # React context for global state
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── types/              # TypeScript interfaces & types
│   ├── user.ts
│   ├── project.ts
│   ├── freelancer.ts
│   └── message.ts
│
├── routes/             # Routing configuration
│   └── AppRoutes.tsx
│
├── styles/             # Global and component styles
│   ├── layouts.css
│   ├── components/
│   │   ├── navbar.css
│   │   ├── footer.css
│   │   └── sidebar.css
│   ├── pages/
│   │   ├── home.css
│   │   ├── auth.css
│   │   └── marketplace.css
│   ├── global.css
│   └── variables.css
│
├── data/               # Mock data and fixtures
│   └── mockData.ts
│
├── assets/             # Static assets
│   ├── images/
│   └── ...
│
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Key Concepts

### 1. **Components** 🧩
- Reusable UI building blocks
- Grouped by feature/domain
- Composed together in pages

### 2. **Pages** 📄
- Full screen components
- Each page has its own route
- Can use layouts and components

### 3. **Layouts** 🏗️
- Wrapper components for pages
- `MainLayout`: Standard pages (with Navbar + Footer)
- `DashboardLayout`: Dashboard pages (with Navbar + Sidebar + Content)

### 4. **Services** 🔗
- API communication layer
- Handles HTTP requests to Django backend
- Centralized data fetching logic
- Each service handles a specific domain (auth, projects, freelancers, messages)

### 5. **Types** 📝
- TypeScript interfaces for type safety
- Shared across components and services
- Makes refactoring easier

### 6. **Context** 🌍
- **AuthContext**: Manages user authentication state and methods
- **ThemeContext**: Manages dark/light mode

### 7. **Hooks** 🎣
- Custom React hooks for logic reuse
- `useAuth()`: Access authentication state
- `useProjects()`: Fetch and manage projects

### 8. **Routes** 🛣️
- Centralized routing configuration
- Protected routes for authenticated users
- Role-based access control

## Environment Setup

Create a `.env.local` file in the frontend root:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=SkillBridge
VITE_APP_VERSION=1.0.0
```

## Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Adding New Pages

1. Create a new file in `src/pages/` (e.g., `src/pages/NewPage.tsx`)
2. Add the component with appropriate imports
3. Register the route in `src/routes/AppRoutes.tsx`
4. Create corresponding styles if needed

## Adding New Components

1. Create a folder under `src/components/` for the category
2. Create component file: `ComponentName.tsx`
3. Add corresponding styles: `ComponentName.css`
4. Export from the component folder if needed

## Working with Services

Services handle all API communication:

```typescript
// Using a service
import projectService from '../services/projectService'

const { projects, isLoading, error } = useProjects()
// Or directly
const projects = await projectService.getProjects()
```

## Authentication Flow

1. User logs in via `Login` page
2. `AuthContext` stores user and token in localStorage
3. `ProtectedRoute` checks authentication status
4. Protected pages are rendered based on user role

## Contributing

- Follow the established folder structure
- Use TypeScript for type safety
- Create meaningful commit messages
- Keep components small and focused
