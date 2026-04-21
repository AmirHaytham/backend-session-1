# BookStore API — Session 1: Express & Mongoose Fundamentals

A hands-on REST API for managing books and authors built with Node.js, Express, and MongoDB.  
This session covers Express project setup, Mongoose schemas with validation, full CRUD operations, pagination, text search, and centralized error handling.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file in the project root (a sample is already included):

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/bookstore
```

### 3. Make sure MongoDB is running, then start the server

```bash
npm run dev   # uses nodemon — auto-restarts on file changes
npm start     # plain node, no auto-restart
```

The server will be available at `http://localhost:3000`.

---

## Project Structure

```
session-1-bookstore-basic/
├── server.js               # Entry point — mounts routes, connects to MongoDB
├── config/
│   └── db.js               # Mongoose connection logic
├── models/
│   ├── Book.js             # Book schema: title, author, isbn, price, genre, publishedYear
│   └── Author.js           # Author schema: name, bio, nationality
├── routes/
│   ├── bookRoutes.js       # All /api/v1/books endpoints
│   └── authorRoutes.js     # All /api/v1/authors endpoints
└── middleware/
    └── errorHandler.js     # Catches any unhandled errors and sends a clean JSON response
```

---

## Books API

Base URL: `/api/v1/books`

---

### GET /api/v1/books — List all books

Supports **pagination**, **full-text search**, and **filtering** by genre or author name.

**Query Parameters**

| Parameter | Type   | Default | Description |
|-----------|--------|---------|-------------|
| `page`    | number | 1       | Page number |
| `limit`   | number | 10      | Results per page (max 50) |
| `search`  | string | —       | Full-text search across title and author |
| `genre`   | string | —       | Exact match on genre (e.g. `Fiction`) |
| `author`  | string | —       | Partial case-insensitive match on author name |

**Example — get page 2 of Fiction books**

```
GET /api/v1/books?genre=Fiction&page=2&limit=5
```

**Response `200 OK`**

```json
{
  "success": true,
  "total": 42,
  "page": 2,
  "pages": 9,
  "count": 5,
  "data": [
    {
      "_id": "664a1f2e8b1c2d3e4f5a6b7c",
      "title": "1984",
      "author": "George Orwell",
      "isbn": "9780451524935",
      "price": 12.99,
      "genre": "Fiction",
      "publishedYear": 1949,
      "createdAt": "2024-05-19T10:00:00.000Z",
      "updatedAt": "2024-05-19T10:00:00.000Z"
    }
  ]
}
```

**Example — full-text search**

```
GET /api/v1/books?search=clean+code
```

---

### GET /api/v1/books/:id — Get a single book

```
GET /api/v1/books/664a1f2e8b1c2d3e4f5a6b7c
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "664a1f2e8b1c2d3e4f5a6b7c",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "price": 29.99,
    "genre": "Technology",
    "publishedYear": 2008,
    "createdAt": "2024-05-19T10:00:00.000Z",
    "updatedAt": "2024-05-19T10:00:00.000Z"
  }
}
```

**Response `404 Not Found`** — when the ID doesn't match any book

```json
{
  "success": false,
  "message": "Book not found"
}
```

---

### POST /api/v1/books — Create a new book

**Request Body**

```json
{
  "title": "The Pragmatic Programmer",
  "author": "David Thomas",
  "isbn": "9780135957059",
  "price": 35.00,
  "genre": "Technology",
  "publishedYear": 2019
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "_id": "664b2a3f9c2d3e4f5a6b7d8e",
    "title": "The Pragmatic Programmer",
    "author": "David Thomas",
    "isbn": "9780135957059",
    "price": 35,
    "genre": "Technology",
    "publishedYear": 2019,
    "createdAt": "2024-05-20T08:30:00.000Z",
    "updatedAt": "2024-05-20T08:30:00.000Z"
  }
}
```

**Response `400 Bad Request`** — validation error (e.g. missing required field or duplicate ISBN)

```json
{
  "success": false,
  "message": "Book validation failed: title: Path `title` is required."
}
```

---

### PUT /api/v1/books/:id — Full update

Replaces all editable fields. Any field you omit will fail validation if it's required.

**Request Body**

```json
{
  "title": "The Pragmatic Programmer",
  "author": "David Thomas",
  "isbn": "9780135957059",
  "price": 39.99,
  "genre": "Technology",
  "publishedYear": 2019
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "664b2a3f9c2d3e4f5a6b7d8e",
    "title": "The Pragmatic Programmer",
    "author": "David Thomas",
    "isbn": "9780135957059",
    "price": 39.99,
    "genre": "Technology",
    "publishedYear": 2019,
    "updatedAt": "2024-05-21T09:00:00.000Z"
  }
}
```

---

### PATCH /api/v1/books/:id — Partial update

Send only the fields you want to change.

**Request Body**

```json
{
  "price": 24.99
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "664b2a3f9c2d3e4f5a6b7d8e",
    "title": "The Pragmatic Programmer",
    "author": "David Thomas",
    "isbn": "9780135957059",
    "price": 24.99,
    "genre": "Technology",
    "publishedYear": 2019,
    "updatedAt": "2024-05-21T10:15:00.000Z"
  }
}
```

---

### DELETE /api/v1/books/:id — Delete a book

```
DELETE /api/v1/books/664b2a3f9c2d3e4f5a6b7d8e
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

## Authors API

Base URL: `/api/v1/authors`

---

### GET /api/v1/authors — List all authors

**Query Parameters**

| Parameter     | Type   | Default | Description |
|---------------|--------|---------|-------------|
| `page`        | number | 1       | Page number |
| `limit`       | number | 10      | Results per page (max 50) |
| `name`        | string | —       | Partial case-insensitive match on name |
| `nationality` | string | —       | Exact match on nationality |

**Example — find all Egyptian authors**

```
GET /api/v1/authors?nationality=Egyptian
```

**Response `200 OK`**

```json
{
  "success": true,
  "total": 3,
  "page": 1,
  "pages": 1,
  "count": 3,
  "data": [
    {
      "_id": "664c3b4a0d3e4f5a6b7c8d9e",
      "name": "Naguib Mahfouz",
      "bio": "Egyptian writer and Nobel Prize laureate known for the Cairo Trilogy.",
      "nationality": "Egyptian",
      "createdAt": "2024-05-19T11:00:00.000Z",
      "updatedAt": "2024-05-19T11:00:00.000Z"
    }
  ]
}
```

---

### GET /api/v1/authors/:id — Get a single author

```
GET /api/v1/authors/664c3b4a0d3e4f5a6b7c8d9e
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "664c3b4a0d3e4f5a6b7c8d9e",
    "name": "Naguib Mahfouz",
    "bio": "Egyptian writer and Nobel Prize laureate known for the Cairo Trilogy.",
    "nationality": "Egyptian",
    "createdAt": "2024-05-19T11:00:00.000Z",
    "updatedAt": "2024-05-19T11:00:00.000Z"
  }
}
```

**Response `404 Not Found`**

```json
{
  "success": false,
  "message": "Author not found"
}
```

---

### POST /api/v1/authors — Create a new author

**Request Body**

```json
{
  "name": "Robert C. Martin",
  "bio": "Software engineer and author, best known for Clean Code and Clean Architecture.",
  "nationality": "American"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "_id": "664d4c5b1e4f5a6b7c8d9eaf",
    "name": "Robert C. Martin",
    "bio": "Software engineer and author, best known for Clean Code and Clean Architecture.",
    "nationality": "American",
    "createdAt": "2024-05-20T09:00:00.000Z",
    "updatedAt": "2024-05-20T09:00:00.000Z"
  }
}
```

---

### PUT /api/v1/authors/:id — Full update

**Request Body**

```json
{
  "name": "Robert C. Martin",
  "bio": "Known as Uncle Bob. Author of Clean Code, The Clean Coder, and Clean Architecture.",
  "nationality": "American"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "664d4c5b1e4f5a6b7c8d9eaf",
    "name": "Robert C. Martin",
    "bio": "Known as Uncle Bob. Author of Clean Code, The Clean Coder, and Clean Architecture.",
    "nationality": "American",
    "updatedAt": "2024-05-21T11:00:00.000Z"
  }
}
```

---

### PATCH /api/v1/authors/:id — Partial update

**Request Body**

```json
{
  "nationality": "American"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "_id": "664d4c5b1e4f5a6b7c8d9eaf",
    "name": "Robert C. Martin",
    "bio": "Known as Uncle Bob. Author of Clean Code, The Clean Coder, and Clean Architecture.",
    "nationality": "American",
    "updatedAt": "2024-05-21T11:30:00.000Z"
  }
}
```

---

### DELETE /api/v1/authors/:id — Delete an author

```
DELETE /api/v1/authors/664d4c5b1e4f5a6b7c8d9eaf
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Author deleted successfully"
}
```

---

## Error Responses

All errors follow the same shape, handled by the centralized `errorHandler` middleware:

```json
{
  "success": false,
  "message": "A human-readable description of what went wrong"
}
```

| Status | When it happens |
|--------|----------------|
| `400`  | Validation failed (missing required field, wrong type, duplicate unique value) |
| `404`  | Resource not found by ID |
| `500`  | Unexpected server error |
