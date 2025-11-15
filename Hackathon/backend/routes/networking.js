import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, queryItems, getItem, scanItems } from '../services/dynamodb.js';

const router = express.Router();

/**
 * GET /api/networking/similar
 * Get users with similar completed courses for networking
 */
router.get('/similar', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user's completed courses
    const userProgress = await queryItems(
      TABLES.USER_PROGRESS,
      'userId = :userId',
      { ':userId': userId },
      'userId-index'
    );

    const completedCourseIds = userProgress
      .filter(p => p.status === 'completed')
      .map(p => p.courseId);

    if (completedCourseIds.length === 0) {
      return res.json({ users: [] });
    }

    // Get all progress records for these courses
    const allProgress = await scanItems(TABLES.USER_PROGRESS);

    // Find users who completed similar courses
    const similarUserIds = new Set();
    allProgress.forEach(progress => {
      if (
        progress.userId !== userId &&
        progress.status === 'completed' &&
        completedCourseIds.includes(progress.courseId)
      ) {
        similarUserIds.add(progress.userId);
      }
    });

    // Get user details for similar users
    const similarUsers = [];
    for (const similarUserId of similarUserIds) {
      const user = await getItem(TABLES.USERS, { userId: similarUserId });
      if (user) {
        // Get their completed courses
        const theirProgress = await queryItems(
          TABLES.USER_PROGRESS,
          'userId = :userId',
          { ':userId': similarUserId },
          'userId-index'
        );

        const theirCompletedCourses = theirProgress
          .filter(p => p.status === 'completed')
          .map(p => p.courseId);

        // Find common courses
        const commonCourses = completedCourseIds.filter(id =>
          theirCompletedCourses.includes(id)
        );

        similarUsers.push({
          userId: user.userId,
          name: `${user.firstName} ${user.lastName}`,
          category: user.category,
          subcategories: user.subcategories,
          location: user.location,
          commonCourses: commonCourses.length
        });
      }
    }

    // Sort by number of common courses
    similarUsers.sort((a, b) => b.commonCourses - a.commonCourses);

    res.json({ users: similarUsers.slice(0, 10) });
  } catch (error) {
    console.error('Get similar users error:', error);
    res.status(500).json({ error: 'Failed to get similar users' });
  }
});

export default router;
