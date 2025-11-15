# SparkPath - Setup Guide

Complete setup guide for the SparkPath career discovery platform.

## Prerequisites

- Node.js 18+ installed
- AWS Account with access to:
  - DynamoDB
  - AWS Bedrock (Claude model enabled)
  - EC2 (for deployment)
- AWS CLI configured with credentials

## Quick Start (Development)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env` file:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Create DynamoDB Tables

```bash
cd backend
node scripts/createTables.js
```

This will create all 9 required tables with proper indexes.

### 4. Seed Sample Data

```bash
node scripts/seedData.js
```

This adds:
- 5 success stories
- 3 mentors
- 3 sample courses

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### 6. Test the Application

1. Go to `http://localhost:5173`
2. Click "Sign Up"
3. Create an account with your details
4. Complete the career assessment
5. Select your subcategories
6. Explore the home dashboard!

## AWS Bedrock Setup

### Enable Claude Model

1. Go to AWS Console → Bedrock
2. Navigate to "Model access"
3. Click "Enable specific models"
4. Enable: `Claude 3 Sonnet`
5. Wait for approval (usually instant for AWS accounts)

### Verify Access

```bash
aws bedrock list-foundation-models --region us-east-1
```

## DynamoDB Tables

The application uses these tables:

1. **SparkPath-Users** - User accounts and profiles
2. **SparkPath-Assessments** - Career assessment results
3. **SparkPath-Courses** - Course catalog
4. **SparkPath-UserProgress** - User course progress
5. **SparkPath-Mentors** - Mentor profiles
6. **SparkPath-SuccessStories** - Success story content
7. **SparkPath-ChatHistory** - Chat conversation logs
8. **SparkPath-Certifications** - User certificates
9. **SparkPath-Pathways** - Career pathway recommendations

## Deployment to EC2

### 1. Prepare EC2 Instance

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Clone and Setup

```bash
git clone your-repo-url
cd Hackathon

# Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build
```

### 3. Configure Environment

```bash
# Create production .env
nano backend/.env
```

Update with production values:
- Use production JWT secret
- Set NODE_ENV=production
- Update FRONTEND_URL to your domain

### 4. Run with PM2

```bash
cd backend
pm2 start server.js --name sparkpath-api
pm2 save
pm2 startup
```

### 5. Serve Frontend

Install nginx:
```bash
sudo yum install -y nginx
```

Configure nginx (`/etc/nginx/conf.d/sparkpath.conf`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/Hackathon/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket for Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Start nginx:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Figma Integration

### Option 1: Manual Export
1. Export designs from Figma as SVG/PNG
2. Place in `frontend/src/assets/`
3. Import in components

### Option 2: Figma Dev Mode
1. Open design in Figma Dev Mode
2. Select component
3. Copy React code
4. Paste into your components
5. Adjust for Tailwind CSS classes

### Option 3: Figma API
1. Generate Figma API token
2. Use `figma-api` npm package
3. Fetch component data programmatically

## Troubleshooting

### Backend won't start
- Check AWS credentials are valid
- Ensure DynamoDB tables exist
- Verify Bedrock model access

### Frontend can't connect
- Check CORS settings in backend
- Verify API_BASE_URL in frontend
- Check network/firewall rules

### Socket.io not connecting
- Ensure WebSocket support on your server
- Check proxy configuration for `/socket.io`
- Verify SOCKET_URL is correct

### DynamoDB errors
- Check IAM permissions for DynamoDB
- Verify table names match
- Ensure region is correct

## Development Tips

### Hot Reload
Both frontend and backend support hot reload in development mode.

### Debugging
- Backend: Use `console.log()` or Node debugger
- Frontend: React DevTools browser extension
- Network: Browser DevTools Network tab

### Testing User Flow
1. Create test user
2. Complete assessment
3. Check home page loads mentors/courses
4. Start a course
5. Trigger wellness check at 25%
6. Complete course for certification
7. View networking page

## Production Checklist

- [ ] Environment variables set correctly
- [ ] DynamoDB tables created
- [ ] Sample data seeded
- [ ] AWS Bedrock access enabled
- [ ] JWT secret is strong and unique
- [ ] CORS configured for production domain
- [ ] Frontend built for production
- [ ] PM2 running backend
- [ ] Nginx serving frontend
- [ ] SSL certificate installed (recommended)
- [ ] Domain DNS configured
- [ ] Monitoring/logging setup

## Support

For issues or questions:
- Check logs: `pm2 logs sparkpath-api`
- Review DynamoDB tables in AWS Console
- Check Bedrock usage/quotas
- Verify EC2 security groups

## Next Steps

After setup:
1. Customize success stories for your use case
2. Add real course content
3. Connect real mentor profiles
4. Implement PDF certificate generation
5. Add email notifications
6. Set up analytics

Good luck with your hackathon! 🚀
