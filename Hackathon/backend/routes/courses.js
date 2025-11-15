import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, queryItems, scanItems, getItem } from '../services/dynamodb.js';

const router = express.Router();

/**
 * GET /api/courses/recommended/:userId
 * Get recommended courses for user based on career path
 */
router.get('/recommended/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user profile
    const user = await getItem(TABLES.USERS, { userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all courses (in production, use GSI by category/subcategory)
    let courses = await scanItems(TABLES.COURSES);

    if (!courses || courses.length === 0) {
      return res.json({ courses: [] });
    }

    // Filter by user's category and subcategories
    courses = courses.filter(course => {
      if (course.category !== user.category) return false;
      if (user.subcategories && user.subcategories.length > 0) {
        return user.subcategories.includes(course.subcategory);
      }
      return true;
    });

    // Sort by difficulty (beginner first)
    const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    courses.sort((a, b) => {
      return (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2);
    });

    res.json({ courses });
  } catch (error) {
    console.error('Get recommended courses error:', error);
    res.status(500).json({ error: 'Failed to get recommended courses' });
  }
});

/**
 * GET /api/courses/:courseId
 * Get course details
 */
router.get('/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await getItem(TABLES.COURSES, { courseId });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
});

/**
 * GET /api/courses/all
 * Get all courses
 */
router.get('/', async (req, res) => {
  try {
    const courses = await scanItems(TABLES.COURSES);
    res.json({ courses: courses || [] });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

export default router;
