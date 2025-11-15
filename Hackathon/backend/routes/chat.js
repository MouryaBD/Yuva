import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, queryItems, updateItem } from '../services/dynamodb.js';

const router = express.Router();

/**
 * GET /api/chat/history/:sessionId
 * Get chat history for a session
 */
router.get('/history/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const messages = await queryItems(
      TABLES.CHAT_HISTORY,
      'chatId = :chatId',
      { ':chatId': `${userId}#${sessionId}` }
    );

    res.json({ messages: messages || [] });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

/**
 * POST /api/chat/save-subcategories
 * Save selected subcategories after assessment
 */
router.post('/save-subcategories', authenticateToken, async (req, res) => {
  try {
    const { assessmentId, selectedSubcategories } = req.body;
    const userId = req.user.userId;

    // Update assessment
    await updateItem(
      TABLES.ASSESSMENTS,
      { assessmentId },
      'SET selectedSubcategories = :subcategories',
      { ':subcategories': selectedSubcategories }
    );

    // Get assessment to get category
    const assessments = await queryItems(
      TABLES.ASSESSMENTS,
      'assessmentId = :assessmentId',
      { ':assessmentId': assessmentId }
    );

    if (assessments && assessments.length > 0) {
      const assessment = assessments[0];

      // Update user profile
      await updateItem(
        TABLES.USERS,
        { userId },
        'SET category = :category, subcategories = :subcategories, isNewUser = :isNewUser',
        {
          ':category': assessment.recommendedCategory,
          ':subcategories': selectedSubcategories,
          ':isNewUser': false
        }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Save subcategories error:', error);
    res.status(500).json({ error: 'Failed to save subcategories' });
  }
});

export default router;
