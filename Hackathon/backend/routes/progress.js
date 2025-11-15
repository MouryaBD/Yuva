import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, getItem, putItem, updateItem, queryItems } from '../services/dynamodb.js';

const router = express.Router();

/**
 * GET /api/progress/:userId/:courseId
 * Get user progress for a course
 */
router.get('/:userId/:courseId', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const progressId = `${userId}#${courseId}`;

    const progress = await getItem(TABLES.USER_PROGRESS, { progressId });

    if (!progress) {
      // No progress yet, return initial state
      return res.json({
        progress: {
          progressId,
          userId,
          courseId,
          completedLessons: [],
          currentModule: '1',
          currentLesson: '1-1',
          percentComplete: 0,
          wellnessCheckCompleted: false,
          status: 'not_started'
        }
      });
    }

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

/**
 * POST /api/progress/start
 * Start a course
 */
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const progressId = `${userId}#${courseId}`;

    // Check if already started
    const existing = await getItem(TABLES.USER_PROGRESS, { progressId });

    if (existing) {
      return res.json({ progress: existing });
    }

    const progress = {
      progressId,
      userId,
      courseId,
      completedLessons: [],
      currentModule: '1',
      currentLesson: '1-1',
      percentComplete: 0,
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      wellnessCheckCompleted: false,
      status: 'in_progress'
    };

    await putItem(TABLES.USER_PROGRESS, progress);

    res.json({ progress });
  } catch (error) {
    console.error('Start course error:', error);
    res.status(500).json({ error: 'Failed to start course' });
  }
});

/**
 * PUT /api/progress/update
 * Update course progress (mark lesson complete)
 */
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;
    const progressId = `${userId}#${courseId}`;

    // Get current progress
    const progress = await getItem(TABLES.USER_PROGRESS, { progressId });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found. Start the course first.' });
    }

    // Get course to calculate percentage
    const course = await getItem(TABLES.COURSES, { courseId });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add lesson to completed if not already there
    const completedLessons = progress.completedLessons || [];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    // Calculate percentage
    const totalLessons = course.totalLessons || 20;
    const percentComplete = Math.round((completedLessons.length / totalLessons) * 100);

    // Determine status
    let status = 'in_progress';
    if (percentComplete >= 100) {
      status = 'completed';
    }

    // Update progress
    const updated = await updateItem(
      TABLES.USER_PROGRESS,
      { progressId },
      'SET completedLessons = :lessons, percentComplete = :percent, lastAccessedAt = :lastAccessed, #status = :status',
      {
        ':lessons': completedLessons,
        ':percent': percentComplete,
        ':lastAccessed': new Date().toISOString(),
        ':status': status
      },
      { '#status': 'status' }
    );

    // Check if wellness check should be triggered (at 25%)
    const needsWellnessCheck = percentComplete >= 25 && !progress.wellnessCheckCompleted;

    res.json({
      progress: updated,
      needsWellnessCheck
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * GET /api/progress/user/:userId
 * Get all progress for a user
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const progressList = await queryItems(
      TABLES.USER_PROGRESS,
      'userId = :userId',
      { ':userId': userId },
      'userId-index'
    );

    res.json({ progress: progressList || [] });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Failed to get user progress' });
  }
});

export default router;
