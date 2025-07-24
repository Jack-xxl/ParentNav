const express = require('express');
const router = express.Router();

const callQianwen = require('../services/callQianwenApi');
const userManager = require('../services/userManager');

router.post('/', async (req, res) => {
  console.log('收到请求体:', req.body);  // 必须能看到这行！
  try {
    const { userId, question, childInfo } = req.body;
    const access = userManager.checkUserAccess(userId);
    if (!access.allowed) {
      return res.status(403).json({ error: access.message });
    }
    const answer = await callQianwen(question, childInfo);
    userManager.recordUsage(userId);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Qianwen API调用失败' });
  }
});

module.exports = router;
