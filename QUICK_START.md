# PoojaSetu Backend - Quick Start Guide

## Start Everything

### Terminal 1: Start MongoDB
```bash
# If not already running
mongod
```

### Terminal 2: Start Backend
```bash
cd backend
npm start
```

### Terminal 3: Start React Native App
```bash
npm start
```

## First Time Setup

```bash
# Seed the database (run once)
cd backend
node src/seed.js
```

## Test Backend is Working

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/temples
curl http://localhost:3000/api/poojas
```

All backends services should return JSON data.

## Default Port
- **Backend API**: http://localhost:3000
- **React Native Metro**: http://localhost:8081
- **MongoDB**: mongodb://localhost:27017/poojasetu

That's it! The app is ready to use with the live backend. 🎉
