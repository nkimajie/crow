# Event Management API

A REST API for managing event categories organized in a tree structure.

## Features

- Create categories with optional parent categories
- Remove categories (including all child categories)
- Fetch a category's subtree
- Move a category (and its subtree) to a new parent

## Prerequisites

- Node.js
- PostgreSQL
- npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npm run prisma:migrate:dev
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://postgres.mzfyowjjqmlnzorzgjqc:ABab12.,@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
NODE_ENV=development
```

## Running the Application

Development mode:
```bash
npm run start:dev
```

## API Endpoints

### Categories

#### Create a Category
```http
POST /categories
```

Request body:
```json
{
  "label": "Category Name",
  "parentId": 1
}
```

#### Remove a Category
```http
DELETE /categories/:id
```

#### Get Category Subtree
```http
GET /categories/:id/subtree
```

#### Move Category
```http
PUT /categories/:id/move/:newParentId
```

## Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:cov
```

## License

UNLICENSED