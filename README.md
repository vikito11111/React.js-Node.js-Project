# Node.js + React.js Web Application

A full-stack web application with Node.js backend and React.js frontend.

## Project Structure

```
.
├── server/          # Backend (Node.js + Express)
├── client/          # Frontend (React.js)
└── package.json     # Root package.json with helper scripts
```

## Getting Started

### Running the Application

1. **Start the backend server:**
   ```bash
   npm run server
   ```
   The server will run on http://localhost:5000

2. **Start the frontend (in a new terminal):**
   ```bash
   npm run client
   ```
   The React app will run on http://localhost:3000

### Development

- Backend code is in the [server/](server/) folder
- Frontend code is in the [client/](client/) folder
- The backend API endpoint is available at http://localhost:5000/api

## Tech Stack

**Backend:**
- Node.js
- Express.js
- CORS enabled for frontend communication

**Frontend:**
- React.js
- React Scripts
