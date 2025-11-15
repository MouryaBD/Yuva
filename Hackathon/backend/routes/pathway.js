import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { TABLES, queryItems, putItem, getItem, updateItem } from '../services/dynamodb.js';
import { generateCareerPathway } from '../services/bedrock.js';

const router = express.Router();

/**
 * GET /api/pathway/:userId
 * Get or generate career pathway for user
 */
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if pathway already exists
    const existingPathways = await queryItems(
      TABLES.PATHWAYS,
      'userId = :userId',
      { ':userId': userId },
      'userId-index'
    );

    if (existingPathways && existingPathways.length > 0) {
      return res.json({ pathway: existingPathways[0] });
    }

    // Get user profile
    const user = await getItem(TABLES.USERS, { userId });

    if (!user || !user.category || !user.subcategories || user.subcategories.length === 0) {
      return res.status(400).json({ error: 'User needs to complete assessment first' });
    }

    // Generate pathway using LLM
    const primarySubcategory = user.subcategories[0];
    const steps = await generateCareerPathway(user.category, primarySubcategory, {
      location: user.location
    });

    // Create default steps if LLM fails
    const defaultSteps = [
      {
        stepNumber: 1,
        title: 'Build Foundational Knowledge',
        description: `Learn the fundamentals of ${primarySubcategory}`,
        estimatedTime: '2-3 months',
        resources: [],
        completed: false
      },
      {
        stepNumber: 2,
        title: 'Gain Practical Experience',
        description: 'Work on real projects and build your portfolio',
        estimatedTime: '3-6 months',
        resources: [],
        completed: false
      },
      {
        stepNumber: 3,
        title: 'Network and Find Mentors',
        description: 'Connect with professionals in your field',
        estimatedTime: 'Ongoing',
        resources: [],
        completed: false
      },
      {
        stepNumber: 4,
        title: 'Seek Entry-Level Opportunities',
        description: 'Apply for internships or junior positions',
        estimatedTime: '1-2 months',
        resources: [],
        completed: false
      },
      {
        stepNumber: 5,
        title: 'Continue Learning and Growing',
        description: 'Stay updated with industry trends',
        estimatedTime: 'Ongoing',
        resources: [],
        completed: false
      }
    ];

    const pathwaySteps = steps || defaultSteps;

    const pathwayId = uuidv4();
    const pathway = {
      pathwayId,
      userId,
      category: user.category,
      subcategory: primarySubcategory,
      steps: pathwaySteps,
      createdAt: new Date().toISOString(),
      overriddenByAdvisor: false,
      advisorNotes: null
    };

    await putItem(TABLES.PATHWAYS, pathway);

    res.json({ pathway });
  } catch (error) {
    console.error('Get pathway error:', error);
    res.status(500).json({ error: 'Failed to get career pathway' });
  }
});

/**
 * PUT /api/pathway/:pathwayId/override
 * Career advisor override pathway
 */
router.put('/:pathwayId/override', authenticateToken, async (req, res) => {
  try {
    const { pathwayId } = req.params;
    const { newCategory, newSubcategory, advisorNotes } = req.body;

    const pathway = await getItem(TABLES.PATHWAYS, { pathwayId });

    if (!pathway) {
      return res.status(404).json({ error: 'Pathway not found' });
    }

    // Generate new pathway
    const user = await getItem(TABLES.USERS, { userId: pathway.userId });
    const newSteps = await generateCareerPathway(newCategory, newSubcategory, user);

    await updateItem(
      TABLES.PATHWAYS,
      { pathwayId },
      'SET category = :category, subcategory = :subcategory, steps = :steps, overriddenByAdvisor = :overridden, advisorNotes = :notes',
      {
        ':category': newCategory,
        ':subcategory': newSubcategory,
        ':steps': newSteps,
        ':overridden': true,
        ':notes': advisorNotes
      }
    );

    // Update user profile
    await updateItem(
      TABLES.USERS,
      { userId: pathway.userId },
      'SET category = :category, subcategories = :subcategories',
      {
        ':category': newCategory,
        ':subcategories': [newSubcategory]
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Override pathway error:', error);
    res.status(500).json({ error: 'Failed to override pathway' });
  }
});

export default router;
