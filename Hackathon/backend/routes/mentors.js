import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, queryItems, scanItems, getItem } from '../services/dynamodb.js';

const router = express.Router();

/**
 * GET /api/mentors/match
 * Get matched mentors for user
 */
router.get('/match', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user profile
    const user = await getItem(TABLES.USERS, { userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all mentors (in production, use GSI to filter by category)
    let mentors = await scanItems(TABLES.MENTORS);

    if (!mentors || mentors.length === 0) {
      return res.json({ mentors: [] });
    }

    // Filter by user's category
    if (user.category) {
      mentors = mentors.filter(m => m.category === user.category);
    }

    // Filter by user's subcategories
    if (user.subcategories && user.subcategories.length > 0) {
      mentors = mentors.filter(m =>
        m.subcategories.some(sc => user.subcategories.includes(sc))
      );
    }

    // Prioritize by location match
    mentors.sort((a, b) => {
      const aLocationMatch = a.location === user.location ? 1 : 0;
      const bLocationMatch = b.location === user.location ? 1 : 0;
      if (aLocationMatch !== bLocationMatch) {
        return bLocationMatch - aLocationMatch;
      }
      // Then by rating
      return (b.rating || 0) - (a.rating || 0);
    });

    // Return top 5 mentors
    res.json({ mentors: mentors.slice(0, 5) });
  } catch (error) {
    console.error('Match mentors error:', error);
    res.status(500).json({ error: 'Failed to match mentors' });
  }
});

/**
 * GET /api/mentors/all
 * Get all mentors
 */
router.get('/all', async (req, res) => {
  try {
    const mentors = await scanItems(TABLES.MENTORS);
    res.json({ mentors: mentors || [] });
  } catch (error) {
    console.error('Get all mentors error:', error);
    res.status(500).json({ error: 'Failed to get mentors' });
  }
});

export default router;
