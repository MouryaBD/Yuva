import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, scanItems, getItem } from '../services/dynamodb.js';
import { rankSuccessStories } from '../services/bedrock.js';

const router = express.Router();

/**
 * GET /api/stories/matched
 * Get success stories matched to user profile
 */
router.get('/matched', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user profile
    const user = await getItem(TABLES.USERS, { userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all stories (in production, filter by category first)
    const allStories = await scanItems(TABLES.SUCCESS_STORIES);

    if (!allStories || allStories.length === 0) {
      return res.json({ stories: [] });
    }

    // Filter by category if user has one
    let filteredStories = allStories;
    if (user.category) {
      filteredStories = allStories.filter(s => s.category === user.category);
    }

    // Use LLM to rank by relevance
    const rankedStories = await rankSuccessStories(filteredStories, {
      category: user.category,
      location: user.location,
      race: user.race,
      ethnicity: user.ethnicity
    });

    // Return top 5
    res.json({ stories: rankedStories.slice(0, 5) });
  } catch (error) {
    console.error('Get matched stories error:', error);
    res.status(500).json({ error: 'Failed to get success stories' });
  }
});

/**
 * GET /api/stories/all
 * Get all success stories (for admin/browsing)
 */
router.get('/all', async (req, res) => {
  try {
    const stories = await scanItems(TABLES.SUCCESS_STORIES);
    res.json({ stories: stories || [] });
  } catch (error) {
    console.error('Get all stories error:', error);
    res.status(500).json({ error: 'Failed to get stories' });
  }
});

export default router;
