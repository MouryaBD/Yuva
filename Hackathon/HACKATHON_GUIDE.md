# SparkPath - Hackathon Presentation Guide

## Executive Summary

**Problem**: Youth poverty remains a critical challenge. Many young people lack clear career pathways and mentorship.

**Solution**: SparkPath - An AI-powered career discovery platform that:
- Matches youth to entertainment careers through personality assessments
- Provides personalized learning pathways
- Connects them with mentors and success stories
- Tracks progress and provides certifications

**Impact**: Reduce youth poverty by 50% through career clarity, skills development, and professional networking.

---

## Complete Feature List ✅

### 1. Authentication & Onboarding
- [x] Email/password signup and login
- [x] User profile with demographics (race, ethnicity, location)
- [x] JWT-based authentication
- [x] Protected routes and session management

### 2. AI-Powered Career Assessment
- [x] Real-time chatbot using AWS Bedrock (Claude)
- [x] 5-7 conversational questions
- [x] One question at a time (conversational flow)
- [x] LLM determines best category from 6 options
- [x] Socket.io for real-time messaging

### 3. Career Categories & Subcategories
- [x] 6 main categories:
  - Business & Management (10 subcategories)
  - Animation & Visual Effects (2 subcategories)
  - Writing & Journalism (3 subcategories)
  - Music (4 subcategories)
  - Sports (10 subcategories)
  - Film & Television (12 subcategories)
- [x] LLM recommends subcategories
- [x] User selects their preferred subcategories

### 4. Success Stories
- [x] Carousel display of inspiring stories
- [x] Matched by category, race, ethnicity, location
- [x] LLM-powered relevance ranking
- [x] Image, name, role, and story

### 5. Career Pathway
- [x] LLM-generated step-by-step pathway
- [x] Based on selected category/subcategory
- [x] Estimated time for each step
- [x] Visual roadmap display

### 6. Mentor Matching
- [x] Filtered by category and subcategory
- [x] Location and demographic matching
- [x] Mentor profiles with bio and expertise
- [x] External scheduling links (Calendly/Zoom)

### 7. Course System
- [x] Course recommendations based on pathway
- [x] Module and lesson structure
- [x] Progress tracking (percentage complete)
- [x] Mark lessons as complete
- [x] Real-time progress updates

### 8. Wellness Check (25% Milestone)
- [x] Automatically triggered at 25% completion
- [x] AI chatbot survey
- [x] Three outcomes:
  - Happy with path → Continue
  - Unhappy with course → Suggest mentor meeting + alternative subcategories
  - Unhappy with category → Redirect to career advisor

### 9. Career Advisor Override
- [x] Admin panel for career advisors
- [x] Override LLM recommendations
- [x] Assign new category/pathway
- [x] Add advisor notes

### 10. Certification
- [x] Generated at 100% course completion
- [x] Certificate number and issue date
- [x] User name and course name
- [x] Downloadable (PDF support ready)

### 11. Networking
- [x] Find users with similar completed courses
- [x] Ranked by number of common courses
- [x] Profile cards with category and location
- [x] Connect button for networking

### 12. Technical Infrastructure
- [x] Node.js + Express backend
- [x] React + Vite frontend
- [x] Tailwind CSS for styling
- [x] Socket.io for real-time chat
- [x] AWS DynamoDB database
- [x] AWS Bedrock for LLM (Claude)
- [x] EC2 deployment ready

---

## Complete User Journey

### New User Flow:

1. **Landing** → Signup page
2. **Signup** → Enter details (name, email, password, demographics)
3. **Assessment** → AI chatbot asks 5-7 questions
4. **Results** → LLM recommends category + subcategories
5. **Selection** → User picks subcategories
6. **Home Dashboard** → See success stories, pathway, mentors, courses
7. **Course Start** → Enroll in recommended course
8. **Learning** → Progress through modules and lessons
9. **Wellness Check** → At 25%, AI checks satisfaction
10. **Continue/Adjust** → Stay on path or get mentor meeting
11. **Completion** → Reach 100%, earn certificate
12. **Networking** → Connect with peers
13. **Growth** → Continue with more courses

### Returning User Flow:

1. **Login** → Enter credentials
2. **Home Dashboard** → Immediately see personalized content
3. **Resume Course** → Pick up where they left off
4. **All features accessible**

---

## Demonstration Script (5-7 minutes)

### Slide 1: The Problem (30 seconds)
"Youth poverty affects millions. A key driver? Lack of clear career pathways and mentorship. Young people don't know where to start or how to get there."

### Slide 2: Our Solution - SparkPath (30 seconds)
"SparkPath uses AI to match youth with entertainment careers, provide personalized learning paths, and connect them with mentors who look like them and come from similar backgrounds."

### Demo Part 1: Onboarding (1 minute)
1. Show signup page
2. Create test account
3. Emphasize demographic collection for matching

### Demo Part 2: AI Assessment (2 minutes)
1. Show chatbot interface
2. Answer 2-3 questions live
3. Show AI analyzing and recommending category
4. Select subcategories

### Demo Part 3: Personalized Dashboard (2 minutes)
1. **Success Stories**: "See role models who match your background"
2. **Career Pathway**: "Step-by-step roadmap generated by AI"
3. **Mentors**: "Real professionals ready to help you"
4. **Courses**: "Personalized learning to build your skills"

### Demo Part 4: Learning Journey (1.5 minutes)
1. Start a course
2. Show progress tracking
3. Explain 25% wellness check
4. Show certification screen

### Demo Part 5: Impact (30 seconds)
"By combining AI, personalized pathways, mentorship, and skills development, we're addressing the root causes of youth poverty—giving every young person a clear path to success."

---

## Technical Highlights for Judges

- **AWS Bedrock Integration**: Real conversational AI using Claude
- **Real-time Communication**: Socket.io for instant chatbot responses
- **Intelligent Matching**: LLM analyzes user responses and demographics
- **Scalable Architecture**: DynamoDB + serverless-ready design
- **Modern Stack**: React, Node.js, Tailwind CSS
- **Complete User Journey**: From signup to certification

---

## Key Differentiators

1. **AI-First Approach**: Not just forms—actual conversations with AI
2. **Demographic Matching**: Success stories and mentors reflect user's background
3. **Adaptive Learning**: Wellness checks catch struggles early
4. **Career Advisor Override**: Human expertise can override AI
5. **Holistic System**: Assessment → Learning → Mentorship → Networking → Jobs

---

## Demo Account Setup

Create a demo account beforehand:
- **Email**: demo@sparkpath.com
- **Password**: Demo123!
- **Name**: Alex Rivera
- **Location**: Los Angeles, CA
- **Already completed assessment** → Shows full home dashboard

---

## Backup Plans

### If AWS is slow:
- Have screenshots/video recording ready
- Walk through the flow with slides

### If demo breaks:
- Have a pre-recorded video
- Focus on architecture and impact

### If time is short:
- Skip course detail page
- Jump directly to certification and networking

---

## Post-Demo Q&A Prep

**Q: How do you ensure AI recommendations are accurate?**
A: We use Claude 3 Sonnet, trained on vast datasets. Plus, career advisors can override any recommendation.

**Q: What about users without internet access?**
A: Phase 2 could include SMS-based chatbot or partnerships with libraries/community centers.

**Q: How do you scale this?**
A: AWS DynamoDB and serverless architecture allow infinite scale. Bedrock handles AI at scale.

**Q: What about privacy?**
A: We collect minimal data, use AWS security, and don't share personal info with third parties.

**Q: How do you monetize?**
A: Freemium model—basic pathways free, premium mentorship/courses paid. Grants and partnerships for low-income youth.

**Q: Beyond entertainment?**
A: The platform is extensible to tech, healthcare, trades—any career field.

---

## Final Checklist Before Demo

- [ ] Backend running on EC2 or localhost
- [ ] Frontend accessible via URL
- [ ] Demo account created and tested
- [ ] Sample data seeded (stories, mentors, courses)
- [ ] AWS Bedrock working (test chatbot)
- [ ] Slides prepared
- [ ] Video backup recorded
- [ ] Team roles assigned (who presents what)
- [ ] 2-minute pitch memorized
- [ ] Q&A answers practiced

---

## Judging Criteria Focus

### Innovation (25%)
- AI-powered conversational assessment
- LLM-based matching and pathway generation
- Real-time wellness checks

### Impact (25%)
- Addresses youth poverty directly
- Scalable to millions
- Measurable outcomes (certifications, job placements)

### Technical Execution (25%)
- Full-stack application
- AWS integration (Bedrock, DynamoDB)
- Real-time features (Socket.io)

### Presentation (25%)
- Clear problem/solution
- Live demo works smoothly
- Compelling story

---

## Post-Hackathon Next Steps

1. **User Testing**: Test with real youth
2. **Mentor Recruitment**: Partner with industry professionals
3. **Course Content**: Create or partner for real courses
4. **Partnerships**: Reach out to:
   - Boys & Girls Clubs
   - YMCA
   - Urban League
   - Local schools
5. **Funding**: Apply for grants, pitch to VCs focused on social impact

---

## Team Presentation Tips

- **Be passionate**: You're solving a real problem
- **Tell a story**: Not just features, but impact
- **Show confidence**: You built this in 12 hours!
- **Emphasize AI**: Judges love AI innovation
- **Be prepared**: Test everything twice

**You've got this! Good luck! 🚀**
