# SparkPath - Quick Start Guide

Get up and running in 10 minutes!

## Prerequisites
- Node.js 18+ installed
- AWS account with Bedrock access
- AWS credentials configured

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure AWS (1 minute)

Create `backend/.env`:
```bash
PORT=5000
JWT_SECRET=hackathon_secret_key_2024
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Create Database Tables (3 minutes)

```bash
cd backend
node scripts/createTables.js
```

Wait for all 9 tables to be created.

### 4. Add Sample Data (1 minute)

```bash
node scripts/seedData.js
```

Adds success stories, mentors, and courses.

### 5. Start the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Test It Out (2 minutes)

1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Create account:
   - Email: test@sparkpath.com
   - Password: Test123!
   - Fill in name and details
4. Complete AI assessment
5. Select subcategories
6. Explore dashboard!

## Troubleshooting

**AWS Bedrock Error?**
- Enable Claude model in AWS Console → Bedrock → Model Access

**Tables not creating?**
- Check AWS credentials in .env
- Verify IAM permissions for DynamoDB

**Frontend won't load?**
- Make sure backend is running first
- Check console for errors

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed configuration
- Check [HACKATHON_GUIDE.md](HACKATHON_GUIDE.md) for demo tips
- Review [README.md](README.md) for architecture overview

**Ready to present? You've got all features working! 🎉**
