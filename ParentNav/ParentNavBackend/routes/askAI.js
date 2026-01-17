const express = require('express');
const router = express.Router();

const callQianwen = require('../services/callQianwenApi');
const userManager = require('../services/userManager');
const { validateAIRequest } = require('../middleware/validation');
const { aiLimiter } = require('../middleware/rateLimiting');

// Apply AI-specific rate limiting and validation
router.post('/', aiLimiter, validateAIRequest, async (req, res) => {
  // Remove console.log for production
  if (process.env.NODE_ENV !== 'production') {
    console.log('收到请求体:', req.body);
  }
  
  try {
    const { userId, question, childInfo } = req.body;
    
    // Check user access (existing rate limiting logic)
    const access = userManager.checkUserAccess(userId);
    if (!access.allowed) {
      return res.status(403).json({ error: access.message });
    }
    
    // Call AI service
    const answer = await callQianwen(question, childInfo);
    
    // Record usage
    userManager.recordUsage(userId);
    
    res.json({ answer });
  } catch (err) {
    // Log error for debugging but don't expose internal details
    if (process.env.NODE_ENV !== 'production') {
      console.error('AI API Error:', err);
    }
    
    res.status(500).json({ 
      error: 'Service temporarily unavailable. Please try again later.' 
    });
  }
});

module.exports = router;
