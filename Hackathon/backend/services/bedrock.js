import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import dotenv from 'dotenv';

dotenv.config();

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

/**
 * Invoke Claude via AWS Bedrock
 */
export const invokeClaude = async (prompt, systemPrompt = '', maxTokens = 2000) => {
  try {
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      ...(systemPrompt && { system: systemPrompt })
    };

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.content[0].text;
  } catch (error) {
    console.error('Bedrock invocation error:', error);
    throw new Error('Failed to get LLM response');
  }
};

/**
 * Career Assessment System Prompt
 */
export const CAREER_ASSESSMENT_SYSTEM_PROMPT = `You are a friendly career counselor chatbot helping young people discover their career path in the entertainment industry.

Your goal is to ask 5-7 conversational questions to determine which category fits best:
- BUSINESS & MANAGEMENT
- ANIMATION & VISUAL EFFECTS
- WRITING & JOURNALISM
- MUSIC
- SPORTS
- FILM & TELEVISION

Guidelines:
1. Ask ONE question at a time
2. Be warm, encouraging, and conversational
3. Build on their previous answers
4. Ask about interests, strengths, what excites them
5. After 5-7 questions, recommend a category and explain why
6. Keep responses concise (2-3 sentences max)

When ready to recommend, format your response as:
RECOMMENDATION: [CATEGORY]
REASON: [1-2 sentence explanation]`;

/**
 * Analyze career assessment conversation
 */
export const analyzeCareerAssessment = async (conversationHistory) => {
  const prompt = `Based on this conversation, determine the best career category:

${conversationHistory.map(msg => `${msg.role}: ${msg.message}`).join('\n')}

Analyze the user's interests and recommend ONE category from:
- BUSINESS & MANAGEMENT
- ANIMATION & VISUAL EFFECTS
- WRITING & JOURNALISM
- MUSIC
- SPORTS
- FILM & TELEVISION

Respond in this exact format:
CATEGORY: [category name]
CONFIDENCE: [0-100]
REASONING: [brief explanation]`;

  const response = await invokeClaude(prompt);

  // Parse response
  const categoryMatch = response.match(/CATEGORY:\s*(.+)/i);
  const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/i);
  const reasoningMatch = response.match(/REASONING:\s*(.+)/is);

  return {
    category: categoryMatch ? categoryMatch[1].trim() : null,
    confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
    reasoning: reasoningMatch ? reasoningMatch[1].trim() : ''
  };
};

/**
 * Get subcategory recommendations
 */
export const getSubcategoryRecommendations = async (category, userResponses) => {
  const subcategories = {
    'BUSINESS & MANAGEMENT': [
      'Talent Management', 'Talent Agency', 'Production Management',
      'Event Management', 'Marketing & PR', 'Business Development',
      'Legal', 'Accounting/Finance', 'Casting', 'Administrative Support'
    ],
    'ANIMATION & VISUAL EFFECTS': [
      'Animator', 'Graphic Design Artist'
    ],
    'WRITING & JOURNALISM': [
      'Entertainment Journalist', 'Publicist', 'Content Creator'
    ],
    'MUSIC': [
      'Musician/Singer', 'Producer', 'Songwriter', 'Audio Engineer'
    ],
    'SPORTS': [
      'Broadcasting', 'Game Day Operations', 'Events Coordinator',
      'Sound Engineer', 'Advertising', 'Marketing', 'Digital Design',
      'Merchandising', 'Content Production', 'Talent Recruitment'
    ],
    'FILM & TELEVISION': [
      'Acting', 'Directing', 'Writing', 'Casting', 'Cinematography',
      'Editing', 'Sound Design', 'Sound Engineer', 'Costume Design',
      'Set Design/Engineer', 'Equipment Operations', 'Makeup Artists'
    ]
  };

  const availableSubcategories = subcategories[category] || [];

  const prompt = `The user is interested in ${category}. Based on their responses:
${userResponses}

From these subcategories, recommend the top 3-5 that best match their interests:
${availableSubcategories.join(', ')}

Format: Return ONLY a comma-separated list of subcategories, no explanation.`;

  const response = await invokeClaude(prompt, '', 500);

  return response.split(',').map(s => s.trim()).filter(s => availableSubcategories.includes(s));
};

/**
 * Generate career pathway
 */
export const generateCareerPathway = async (category, subcategory, userProfile) => {
  const prompt = `Create a 5-step career pathway for someone interested in:
Category: ${category}
Subcategory: ${subcategory}
Location: ${userProfile.location || 'Unknown'}

Each step should include:
- Title
- Description (1 sentence)
- Estimated time
- Key resources/actions

Format as JSON array of steps.`;

  const response = await invokeClaude(prompt, '', 1500);

  try {
    // Try to parse JSON, fallback to text parsing
    return JSON.parse(response);
  } catch {
    return null;
  }
};

/**
 * Match success stories to user profile
 */
export const rankSuccessStories = async (stories, userProfile) => {
  const prompt = `Rank these success stories by relevance for a user with:
- Category: ${userProfile.category}
- Location: ${userProfile.location}
- Race: ${userProfile.race}
- Ethnicity: ${userProfile.ethnicity}

Stories:
${stories.map((s, i) => `${i + 1}. ${s.name} - ${s.category} - ${s.location}`).join('\n')}

Return ONLY comma-separated story numbers in order of relevance (e.g., "3,1,5,2,4").`;

  const response = await invokeClaude(prompt, '', 300);
  const indices = response.match(/\d+/g)?.map(n => parseInt(n) - 1) || [];

  return indices.map(i => stories[i]).filter(Boolean);
};

/**
 * Wellness check conversation
 */
export const WELLNESS_CHECK_SYSTEM_PROMPT = `You are a supportive career counselor conducting a wellness check.

Ask the user:
1. How they're feeling about their course
2. If the career path still feels right
3. Any challenges they're facing

Based on their responses, determine:
- HAPPY_WITH_PATH: Continue current course
- UNHAPPY_WITH_COURSE: Suggest meeting with mentor, offer alternative subcategories
- UNHAPPY_WITH_CATEGORY: Suggest meeting with career advisor for reassessment

Be empathetic and encouraging.`;

export const analyzeWellnessCheck = async (userResponses) => {
  const prompt = `Analyze this wellness check conversation:

${userResponses}

Determine the outcome:
- HAPPY_WITH_PATH
- UNHAPPY_WITH_COURSE
- UNHAPPY_WITH_CATEGORY

Format:
OUTCOME: [outcome]
REASONING: [brief explanation]
RECOMMENDATION: [specific next steps]`;

  const response = await invokeClaude(prompt);

  const outcomeMatch = response.match(/OUTCOME:\s*(.+)/i);
  const reasoningMatch = response.match(/REASONING:\s*(.+)/i);
  const recommendationMatch = response.match(/RECOMMENDATION:\s*(.+)/is);

  return {
    outcome: outcomeMatch ? outcomeMatch[1].trim() : 'HAPPY_WITH_PATH',
    reasoning: reasoningMatch ? reasoningMatch[1].trim() : '',
    recommendation: recommendationMatch ? recommendationMatch[1].trim() : ''
  };
};

export default { invokeClaude };
