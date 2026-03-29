# LinkWarp API

The official REST API of [LinkWarp](https://linkwarp.pro) — Your personal link hub with permanent URLs.

> "No es sobre acortar links. Es sobre no perderlos."

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database

## 🛠️ Available Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm run build`        | Build TypeScript to JavaScript           |
| `npm run start`        | Start production server                  |
| `npm run test`         | Run tests with Vitest                    |
| `npm run lint`         | Run ESLint                               |
| `npm run format:check` | Check code formatting                    |
| `npm run commit`       | Create a commit with Commitizen          |

## 🏗️ Project Structure

```
src/
├── core/               # Core utilities
│   ├── Controller.ts   # Abstract base controller
│   ├── RequestError.ts # Custom error class
│   └── Response.ts     # Response wrapper
├── controllers/       # Route handlers
├── services/          # Business logic
├── routes/            # Express router definitions
├── schemas/           # Zod validation schemas
├── middlewares/       # Express middleware
├── helpers/           # Utility functions
├── mappers/           # DTO mappers
├── config.ts          # Configuration
├── db.ts              # Prisma client
└── app.ts             # Express app setup
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

Tests are located in the `test/` directory with mocks for Prisma and other dependencies.

## 🔐 API Endpoints

### Authentication

| Method | Endpoint       | Description |
| ------ | -------------- | ----------- |
| POST   | `/auth/login`  | Login user  |
| POST   | `/auth/logout` | Logout user |

### Users

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| POST   | `/users`    | Create new user  |
| GET    | `/users/me` | Get current user |

### Spaces

| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | `/spaces`     | List user's spaces |
| POST   | `/spaces`     | Create new space   |
| GET    | `/spaces/:id` | Get space by ID    |

### Links

| Method | Endpoint                      | Description         |
| ------ | ----------------------------- | ------------------- |
| GET    | `/spaces/:spaceSlug/links`    | List links in space |
| POST   | `/links`                      | Create new link     |
| GET    | `/links/:spaceSlug/:linkSlug` | Get link by slug    |

## 🏭 Architecture

- **Controller → Service → Route** pattern
- **Zod** for input validation
- **Prisma** with PostgreSQL for data persistence
- **JWT** for authentication
- **Express** 5.x middleware

## 📝 License

MIT © Benjamin Rivas Beltrán
