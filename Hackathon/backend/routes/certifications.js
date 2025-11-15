import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, getItem, putItem, queryItems } from '../services/dynamodb.js';

const router = express.Router();

/**
 * POST /api/certifications/generate
 * Generate certification when course is 100% complete
 */
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const progressId = `${userId}#${courseId}`;

    // Verify course is complete
    const progress = await getItem(TABLES.USER_PROGRESS, { progressId });

    if (!progress || progress.percentComplete < 100) {
      return res.status(400).json({ error: 'Course not yet completed' });
    }

    // Get course details
    const course = await getItem(TABLES.COURSES, { courseId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get user details
    const user = await getItem(TABLES.USERS, { userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if certificate already exists
    const existing = await queryItems(
      TABLES.CERTIFICATIONS,
      'userId = :userId AND courseId = :courseId',
      { ':userId': userId, ':courseId': courseId },
      'userId-index'
    );

    if (existing && existing.length > 0) {
      return res.json({ certification: existing[0] });
    }

    // Generate certificate
    const certificationId = uuidv4();
    const certificateNumber = `SPARK-${new Date().getFullYear()}-${certificationId.slice(0, 8).toUpperCase()}`;

    const certification = {
      certificationId,
      userId,
      courseId,
      courseName: course.title,
      userName: `${user.firstName} ${user.lastName}`,
      issuedAt: new Date().toISOString(),
      certificateNumber,
      pdfUrl: null, // In production, generate PDF and upload to S3
      validUntil: null
    };

    await putItem(TABLES.CERTIFICATIONS, certification);

    res.json({ certification });
  } catch (error) {
    console.error('Generate certification error:', error);
    res.status(500).json({ error: 'Failed to generate certification' });
  }
});

/**
 * GET /api/certifications/user/:userId
 * Get all certifications for a user
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const certifications = await queryItems(
      TABLES.CERTIFICATIONS,
      'userId = :userId',
      { ':userId': userId },
      'userId-index'
    );

    res.json({ certifications: certifications || [] });
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ error: 'Failed to get certifications' });
  }
});

/**
 * GET /api/certifications/:certificationId
 * Get specific certification
 */
router.get('/:certificationId', async (req, res) => {
  try {
    const { certificationId } = req.params;

    const certification = await getItem(TABLES.CERTIFICATIONS, { certificationId });

    if (!certification) {
      return res.status(404).json({ error: 'Certification not found' });
    }

    res.json({ certification });
  } catch (error) {
    console.error('Get certification error:', error);
    res.status(500).json({ error: 'Failed to get certification' });
  }
});

export default router;
