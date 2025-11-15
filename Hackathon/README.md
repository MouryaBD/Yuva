# SparkPath - Youth Career Discovery Platform

AI-powered career discovery platform to reduce youth poverty by 50% through personalized career pathways and mentorship.

## Tech Stack

**Backend:**
- Node.js + Express
- Socket.io (real-time chat)
- AWS DynamoDB
- AWS Bedrock (LLM)

**Frontend:**
- React + Vite
- Tailwind CSS
- React Router

## Setup Instructions

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your AWS credentials
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features

- ✅ AI-powered career assessment chatbot
- ✅ Personalized success stories
- ✅ Career pathway recommendations
- ✅ Mentor matching
- ✅ Course management with progress tracking
- ✅ Wellness check surveys
- ✅ Certification generation
- ✅ Peer networking

## AWS Services Used

- EC2 (hosting)
- DynamoDB (database)
- Bedrock (AI/LLM)

## Database Schema

See `/backend/models/schema.md` for DynamoDB table structures.
