import express from 'express';
import axios from 'axios';
import ChatHistory from '../models/ChatHistory.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;

  const payload = {
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a QA assistant. Help testers with automation, BDD, and TDD." },
      { role: "user", content: message }
    ]
  };

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    await ChatHistory.create({ userId, prompt: message, response: reply });

    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch from DeepSeek' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await ChatHistory.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

export default router;
