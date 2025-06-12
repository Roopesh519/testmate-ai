import express from 'express';
import ChatHistory from '../models/ChatHistory.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Together from 'together-ai';

const router = express.Router();

let together = null;
function getTogetherClient() {
  if (!together) {
    if (!process.env.TOGETHER_API_KEY) {
      console.warn('⚠️ TOGETHER_API_KEY is missing from env!');
    }
    together = new Together(); // Will pull from process.env.TOGETHER_API_KEY
    console.log('🧠 Together client initialized');
  }
  return together;
}

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  const { message } = req.body;

  console.log('📥 Received POST /api/chat');
  console.log('👤 User ID:', userId);
  console.log('💬 Message:', message);

  if (!message || typeof message !== 'string') {
    console.warn('⚠️ Invalid message received');
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  try {
    const client = getTogetherClient();
    console.log('📡 Sending to Together.ai...');
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a QA assistant. Help testers with automation, BDD, and TDD." },
        { role: "user", content: message }
      ],
      model: "deepseek-ai/DeepSeek-V3"
    });

    console.log('✅ Together.ai responded');
    const reply = response.choices?.[0]?.message?.content || '[No reply from model]';
    console.log('🧠 Model Reply:', reply);

    await ChatHistory.create({ userId, prompt: message, response: reply });
    console.log('💾 Chat saved to DB');

    res.json({ reply });
  } catch (err) {
    console.error('❌ Error in chat route:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to fetch from Together.ai' });
  }
});

// Fetch chat history
router.get('/history', authMiddleware, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: no user ID found' });
  }

  try {
    const history = await ChatHistory.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(20); // Limit number of responses (optional)
    
    res.json({ history });
  } catch (err) {
    console.error('❌ Error fetching chat history:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router;
