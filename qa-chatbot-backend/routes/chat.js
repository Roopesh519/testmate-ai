import express from 'express';
import ChatHistory from '../models/ChatHistory.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Together from 'together-ai';
import Conversation from '../models/Conversation.js';

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

// POST message to existing conversation or create a new one
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  const { message, conversationId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  try {
    const client = getTogetherClient();
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a QA assistant. Help testers with automation, BDD, and TDD." },
        { role: "user", content: message }
      ],
      model: "deepseek-ai/DeepSeek-V3"
    });

    const reply = response.choices?.[0]?.message?.content || '[No reply]';
    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.messages.push({ prompt: message, response: reply });
        await conversation.save();
      }
    }

    // If no conversation or invalid ID, create new
    if (!conversation) {
      conversation = new Conversation({
        userId,
        title: message.slice(0, 30), // first message becomes the title
        messages: [{ prompt: message, response: reply }]
      });
      await conversation.save();
    }

    res.json({ reply, conversationId: conversation._id });
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
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

router.get('/conversations', authMiddleware, async (req, res) => {
  const userId = req.user?.id;
  const conversations = await Conversation.find({ userId })
    .sort({ createdAt: -1 })
    .select('title createdAt'); // only show needed fields

  res.json({ conversations });
});

router.get('/conversations/:id', authMiddleware, async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  res.json({ messages: conversation.messages });
});

// DELETE conversation
router.delete('/conversations/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await Conversation.findByIdAndDelete(id);
  res.json({ success: true });
});

// PATCH rename conversation
router.patch('/conversations/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const updated = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
  res.json(updated);
});

export default router;
