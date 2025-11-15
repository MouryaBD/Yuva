# DynamoDB Schema Design

## Table Structures

### 1. Users
**Primary Key**: `userId` (String)
**GSI**: `email-index` on `email`

```javascript
{
  userId: "uuid",
  email: "user@example.com",
  password: "hashed_password",
  firstName: "John",
  lastName: "Doe",
  race: "Asian",
  ethnicity: "Hispanic",
  location: "Los Angeles, CA",
  category: "MUSIC",
  subcategories: ["Producer", "Audio Engineer"],
  isNewUser: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

### 2. Assessments
**Primary Key**: `assessmentId` (String)
**GSI**: `userId-index` on `userId`

```javascript
{
  assessmentId: "uuid",
  userId: "uuid",
  sessionId: "uuid",
  questions: [
    {
      question: "What excites you most about entertainment?",
      answer: "Creating beats and producing music"
    }
  ],
  recommendedCategory: "MUSIC",
  recommendedSubcategories: ["Producer", "Audio Engineer", "Songwriter"],
  selectedSubcategories: ["Producer", "Audio Engineer"],
  completedAt: "2024-01-01T00:00:00Z"
}
```

### 3. Courses
**Primary Key**: `courseId` (String)
**GSI**: `category-index` on `category`, `subcategory-index` on `subcategory`

```javascript
{
  courseId: "uuid",
  title: "Music Production Fundamentals",
  description: "Learn the basics of music production",
  category: "MUSIC",
  subcategory: "Producer",
  modules: [
    {
      moduleId: "1",
      title: "Introduction to DAWs",
      lessons: [
        {
          lessonId: "1-1",
          title: "Getting Started with FL Studio",
          duration: 30,
          videoUrl: "https://...",
          content: "..."
        }
      ]
    }
  ],
  totalLessons: 20,
  estimatedHours: 40,
  difficulty: "Beginner",
  createdAt: "2024-01-01T00:00:00Z"
}
```

### 4. UserProgress
**Primary Key**: `progressId` (String - composite: `userId#courseId`)
**GSI**: `userId-index` on `userId`

```javascript
{
  progressId: "userId#courseId",
  userId: "uuid",
  courseId: "uuid",
  completedLessons: ["1-1", "1-2", "2-1"],
  currentModule: "2",
  currentLesson: "2-2",
  percentComplete: 35,
  startedAt: "2024-01-01T00:00:00Z",
  lastAccessedAt: "2024-01-05T00:00:00Z",
  wellnessCheckCompleted: false,
  status: "in_progress" // in_progress, completed, paused
}
```

### 5. Mentors
**Primary Key**: `mentorId` (String)
**GSI**: `category-index` on `category`, `location-index` on `location`

```javascript
{
  mentorId: "uuid",
  name: "Sarah Johnson",
  category: "MUSIC",
  subcategories: ["Producer", "Audio Engineer"],
  bio: "Award-winning music producer with 15 years experience...",
  imageUrl: "https://...",
  race: "Black",
  ethnicity: "African American",
  location: "Atlanta, GA",
  availability: "https://calendly.com/sarahjohnson",
  meetingLink: "https://zoom.us/j/...",
  expertise: ["Hip Hop", "R&B", "Sound Engineering"],
  yearsExperience: 15,
  rating: 4.9,
  totalSessions: 150
}
```

### 6. SuccessStories
**Primary Key**: `storyId` (String)
**GSI**: `category-index` on `category`, `ethnicity-index` on `ethnicity`, `location-index` on `location`

```javascript
{
  storyId: "uuid",
  name: "Marcus Williams",
  category: "FILM & TELEVISION",
  subcategory: "Directing",
  imageUrl: "https://...",
  race: "Black",
  ethnicity: "African American",
  location: "New York, NY",
  story: "Started as a PA, now directing award-winning documentaries...",
  currentRole: "Documentary Film Director",
  company: "HBO Documentaries",
  achievements: ["Emmy Award 2023", "Sundance Film Festival Winner"],
  videoUrl: "https://...",
  tags: ["inspiring", "film", "directing"]
}
```

### 7. ChatHistory
**Primary Key**: `chatId` (String - composite: `userId#sessionId`)
**Sort Key**: `timestamp` (Number)
**GSI**: `userId-index` on `userId`

```javascript
{
  chatId: "userId#sessionId",
  timestamp: 1234567890,
  userId: "uuid",
  sessionId: "uuid",
  sessionType: "assessment", // assessment, wellness, general
  role: "user", // user, assistant
  message: "I love creating music and beats",
  metadata: {
    questionNumber: 3,
    category: null
  }
}
```

### 8. Certifications
**Primary Key**: `certificationId` (String)
**GSI**: `userId-index` on `userId`

```javascript
{
  certificationId: "uuid",
  userId: "uuid",
  courseId: "uuid",
  courseName: "Music Production Fundamentals",
  issuedAt: "2024-01-01T00:00:00Z",
  pdfUrl: "https://s3.../certificate.pdf",
  certificateNumber: "SPARK-2024-001234",
  validUntil: null
}
```

### 9. CareerPathways
**Primary Key**: `pathwayId` (String)
**GSI**: `userId-index` on `userId`

```javascript
{
  pathwayId: "uuid",
  userId: "uuid",
  category: "MUSIC",
  subcategory: "Producer",
  steps: [
    {
      stepNumber: 1,
      title: "Learn DAW Basics",
      description: "Master a digital audio workstation",
      resources: ["Course: Music Production 101"],
      estimatedTime: "2 months",
      completed: true
    },
    {
      stepNumber: 2,
      title: "Build Portfolio",
      description: "Create 5-10 original tracks",
      resources: ["Soundcloud", "YouTube"],
      estimatedTime: "3 months",
      completed: false
    }
  ],
  createdAt: "2024-01-01T00:00:00Z",
  overriddenByAdvisor: false,
  advisorNotes: null
}
```

## Indexes Summary

Each table requires:
- Primary Key (PK)
- Global Secondary Indexes (GSI) for common query patterns
- Efficient query design to minimize scans

## Notes
- All IDs use UUID v4
- Timestamps in ISO 8601 format or Unix timestamp
- Composite keys use `#` separator
- Enable DynamoDB Streams for real-time features (future)
