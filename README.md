# BookStore API — Session 1: Express & Mongoose Fundamentals

A simple REST API for managing books and authors.  
Covers Express setup, Mongoose models, full CRUD, and centralized error handling.

## Setup

```bash
npm install
```

Create a `.env` file (or copy from the provided one):
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/bookstore
```

Make sure MongoDB is running locally, then:
```bash
npm run dev   # development (nodemon)
npm start     # production
```

## Endpoints

### Books
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/books` | List all books |
| GET | `/api/books/:id` | Get a single book |
| POST | `/api/books` | Create a new book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |

### Authors
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/authors` | List all authors |
| GET | `/api/authors/:id` | Get a single author |
| POST | `/api/authors` | Create a new author |
| PUT | `/api/authors/:id` | Update an author |
| DELETE | `/api/authors/:id` | Delete an author |

## Example Request

```bash
# Create a book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Pragmatic Programmer","author":"David Thomas","price":35,"genre":"Technology","publishedYear":2019}'
```

## Project Structure

```
session-1-bookstore-basic/
├── server.js               # Entry point — Express app + Mongoose connection
├── models/
│   ├── Book.js             # Book schema (title, author, isbn, price, genre, year)
│   └── Author.js           # Author schema (name, bio, nationality)
├── routes/
│   ├── bookRoutes.js       # CRUD routes for /api/books
│   └── authorRoutes.js     # CRUD routes for /api/authors
└── middleware/
    └── errorHandler.js     # Centralized error handling
```
