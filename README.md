# Job Application Tracker

A full-stack web application for managing and tracking job applications throughout your job search.

**[Live Demo](https://job-application-tracker-seven-iota.vercel.app)**

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite
- TailwindCSS
- React Query (TanStack)
- React Hook Form + Zod validation
- Radix UI components
- Cypress (E2E testing)

### Backend
- Spring Boot 4 with Java 21
- Spring Security + JWT authentication
- Spring Data JPA + Hibernate
- PostgreSQL
- Maven

### Infrastructure
- **Frontend**: Vercel
- **Backend**: Railway
- **CI/CD**: GitHub Actions

## Features

- **Authentication** -- secure registration and login with JWT tokens
- **Application management** -- full CRUD for job applications with fields for company, position, location, salary range, work mode, and more
- **Status tracking** -- track each application through 6 stages: Applied, Interviewing, Offer, Accepted, Rejected, Withdrawn
- **Notes** -- add, edit, and delete notes on each application
- **Filtering and sorting** -- filter by status or work mode, sort by date, company, position, or salary
- **Dark mode** -- toggle between light and dark themes

## Getting Started

### Prerequisites
- Java 21
- Node.js 20+
- Docker (for PostgreSQL)

### Backend

1. Start the database:
   ```bash
   docker compose up -d
   ```

2. Create `backend/src/main/resources/application-local.properties` from the example:
   ```bash
   cp backend/src/main/resources/application-local.properties.example \
      backend/src/main/resources/application-local.properties
   ```
   Update the placeholder values. The default Docker credentials are `admin` / `admin123`.

3. Run the backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173

## Project Structure

```
job-tracker/
├── backend/                 # Spring Boot API
│   └── src/main/java/...
│       ├── controller/      # REST endpoints
│       ├── service/         # Business logic
│       ├── repository/      # Data access
│       ├── model/           # JPA entities
│       └── config/          # Security & JWT
├── frontend/                # React SPA
│   └── src/
│       ├── api/             # Axios API clients
│       ├── components/      # UI components
│       ├── context/         # Auth & theme context
│       ├── pages/           # Route pages
│       └── types/           # TypeScript types
└── .github/workflows/       # CI pipelines
```

## Testing

### Backend
```bash
cd backend
./mvnw test
```

### Frontend (E2E)
```bash
cd frontend
npm run test:e2e       # headless
npm run cypress:open   # interactive
```