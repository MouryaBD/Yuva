import { v4 as uuidv4 } from 'uuid';
import { TABLES, putItem } from '../services/dynamodb.js';

const sampleSuccessStories = [
  {
    storyId: uuidv4(),
    name: 'Marcus Williams',
    category: 'FILM & TELEVISION',
    subcategory: 'Directing',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'Black',
    ethnicity: 'African American',
    location: 'Los Angeles, CA',
    story: 'Started as a production assistant, now directing award-winning documentaries for major streaming platforms.',
    currentRole: 'Documentary Director',
    company: 'Netflix Documentaries',
    achievements: ['Emmy Award 2023', 'Sundance Film Festival Winner'],
    tags: ['inspiring', 'film', 'directing']
  },
  {
    storyId: uuidv4(),
    name: 'Sofia Rodriguez',
    category: 'MUSIC',
    subcategory: 'Producer',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'Hispanic',
    ethnicity: 'Latina',
    location: 'Miami, FL',
    story: 'From bedroom producer to Grammy-nominated music producer working with top Latin artists.',
    currentRole: 'Music Producer',
    company: 'Universal Music Latin',
    achievements: ['Grammy Nomination 2024', '5x Platinum Records'],
    tags: ['music', 'production', 'inspiring']
  },
  {
    storyId: uuidv4(),
    name: 'David Chen',
    category: 'ANIMATION & VISUAL EFFECTS',
    subcategory: 'Animator',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'Asian',
    ethnicity: 'Chinese American',
    location: 'San Francisco, CA',
    story: 'Self-taught animator who now leads animation teams at one of the biggest animation studios.',
    currentRole: 'Lead Animator',
    company: 'Pixar Animation Studios',
    achievements: ['Annie Award Winner', '3 Feature Films'],
    tags: ['animation', 'self-taught', 'success']
  },
  {
    storyId: uuidv4(),
    name: 'Aisha Johnson',
    category: 'SPORTS',
    subcategory: 'Broadcasting',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'Black',
    ethnicity: 'African American',
    location: 'Atlanta, GA',
    story: 'From local sports reporter to national sports anchor covering major leagues.',
    currentRole: 'Sports Anchor',
    company: 'ESPN',
    achievements: ['Sports Emmy 2023', 'National Sports Media Association Award'],
    tags: ['sports', 'broadcasting', 'journalism']
  },
  {
    storyId: uuidv4(),
    name: 'Emma Taylor',
    category: 'WRITING & JOURNALISM',
    subcategory: 'Content Creator',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'White',
    ethnicity: 'Caucasian',
    location: 'New York, NY',
    story: 'Built a successful entertainment blog that turned into a full-time career in digital media.',
    currentRole: 'Senior Content Creator',
    company: 'BuzzFeed Entertainment',
    achievements: ['Webby Award', '1M+ Followers'],
    tags: ['writing', 'digital', 'content']
  }
];

const sampleMentors = [
  {
    mentorId: uuidv4(),
    name: 'Sarah Thompson',
    category: 'MUSIC',
    subcategories: ['Producer', 'Audio Engineer'],
    bio: 'Award-winning music producer with 15 years of experience in hip hop and R&B production.',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'Black',
    ethnicity: 'African American',
    location: 'Atlanta, GA',
    availability: 'https://calendly.com/sarahthompson',
    meetingLink: 'https://zoom.us/j/example',
    expertise: ['Hip Hop', 'R&B', 'Sound Engineering'],
    yearsExperience: 15,
    rating: 4.9,
    totalSessions: 150
  },
  {
    mentorId: uuidv4(),
    name: 'Carlos Mendez',
    category: 'FILM & TELEVISION',
    subcategories: ['Directing', 'Cinematography'],
    bio: 'Independent filmmaker and cinematographer passionate about helping the next generation of storytellers.',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'Hispanic',
    ethnicity: 'Latino',
    location: 'Los Angeles, CA',
    availability: 'https://calendly.com/carlosmendez',
    meetingLink: 'https://zoom.us/j/example2',
    expertise: ['Independent Film', 'Cinematography', 'Storytelling'],
    yearsExperience: 12,
    rating: 4.8,
    totalSessions: 95
  },
  {
    mentorId: uuidv4(),
    name: 'Jennifer Lee',
    category: 'ANIMATION & VISUAL EFFECTS',
    subcategories: ['Animator', 'Graphic Design Artist'],
    bio: 'Senior animator at major studio with expertise in 2D and 3D animation.',
    imageUrl: 'https://via.placeholder.com/150',
    race: 'Asian',
    ethnicity: 'Korean American',
    location: 'San Francisco, CA',
    availability: 'https://calendly.com/jenniferlee',
    meetingLink: 'https://zoom.us/j/example3',
    expertise: ['3D Animation', '2D Animation', 'Character Design'],
    yearsExperience: 10,
    rating: 5.0,
    totalSessions: 120
  }
];

const sampleCourses = [
  {
    courseId: uuidv4(),
    title: 'Music Production Fundamentals',
    description: 'Learn the basics of music production using industry-standard DAWs.',
    category: 'MUSIC',
    subcategory: 'Producer',
    modules: [
      {
        moduleId: '1',
        title: 'Introduction to DAWs',
        lessons: [
          {
            lessonId: '1-1',
            title: 'Getting Started with FL Studio',
            duration: 30,
            videoUrl: 'https://example.com/video1',
            content: 'Learn the basics of FL Studio interface and workflow.'
          },
          {
            lessonId: '1-2',
            title: 'Understanding MIDI',
            duration: 25,
            videoUrl: 'https://example.com/video2',
            content: 'Understand MIDI and how to use it in production.'
          }
        ]
      },
      {
        moduleId: '2',
        title: 'Beat Making Basics',
        lessons: [
          {
            lessonId: '2-1',
            title: 'Drum Programming',
            duration: 35,
            videoUrl: 'https://example.com/video3',
            content: 'Learn how to program drums for different genres.'
          },
          {
            lessonId: '2-2',
            title: 'Melody Creation',
            duration: 40,
            videoUrl: 'https://example.com/video4',
            content: 'Create catchy melodies using scales and music theory.'
          }
        ]
      }
    ],
    totalLessons: 4,
    estimatedHours: 2,
    difficulty: 'Beginner',
    createdAt: new Date().toISOString()
  },
  {
    courseId: uuidv4(),
    title: 'Directing for Film and TV',
    description: 'Master the fundamentals of directing for screen.',
    category: 'FILM & TELEVISION',
    subcategory: 'Directing',
    modules: [
      {
        moduleId: '1',
        title: 'Directing Fundamentals',
        lessons: [
          {
            lessonId: '1-1',
            title: 'Vision and Storytelling',
            duration: 45,
            videoUrl: 'https://example.com/video5',
            content: 'Develop your directorial vision and storytelling approach.'
          },
          {
            lessonId: '1-2',
            title: 'Working with Actors',
            duration: 50,
            videoUrl: 'https://example.com/video6',
            content: 'Learn how to communicate with and direct actors effectively.'
          }
        ]
      }
    ],
    totalLessons: 2,
    estimatedHours: 1.5,
    difficulty: 'Beginner',
    createdAt: new Date().toISOString()
  },
  {
    courseId: uuidv4(),
    title: '2D Animation Essentials',
    description: 'Create stunning 2D animations from scratch.',
    category: 'ANIMATION & VISUAL EFFECTS',
    subcategory: 'Animator',
    modules: [
      {
        moduleId: '1',
        title: 'Animation Principles',
        lessons: [
          {
            lessonId: '1-1',
            title: 'The 12 Principles of Animation',
            duration: 40,
            videoUrl: 'https://example.com/video7',
            content: 'Master the fundamental principles of animation.'
          },
          {
            lessonId: '1-2',
            title: 'Timing and Spacing',
            duration: 35,
            videoUrl: 'https://example.com/video8',
            content: 'Learn how timing and spacing bring animations to life.'
          }
        ]
      }
    ],
    totalLessons: 2,
    estimatedHours: 1.25,
    difficulty: 'Beginner',
    createdAt: new Date().toISOString()
  }
];

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...\n');

  try {
    // Seed Success Stories
    console.log('📚 Adding success stories...');
    for (const story of sampleSuccessStories) {
      await putItem(TABLES.SUCCESS_STORIES, story);
      console.log(`✓ Added story: ${story.name}`);
    }

    // Seed Mentors
    console.log('\n👥 Adding mentors...');
    for (const mentor of sampleMentors) {
      await putItem(TABLES.MENTORS, mentor);
      console.log(`✓ Added mentor: ${mentor.name}`);
    }

    // Seed Courses
    console.log('\n📖 Adding courses...');
    for (const course of sampleCourses) {
      await putItem(TABLES.COURSES, course);
      console.log(`✓ Added course: ${course.title}`);
    }

    console.log('\n✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();
