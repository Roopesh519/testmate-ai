import express from 'express';
import ChatHistory from '../models/ChatHistory.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Together from 'together-ai';
import Conversation from '../models/Conversation.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
// import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

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
  const { messages, conversationId } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Check that the last message is from user
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== 'user' || typeof lastMessage.content !== 'string') {
    return res.status(400).json({ error: 'Last message must be from user and must be a string' });
  }

  try {
    const client = getTogetherClient();

    // Add a system prompt at the top, always
    const messagesWithSystem = [
      { role: "system", content: "You are a QA assistant. Help testers with automation, BDD, and TDD." },
      ...messages
    ];

    const response = await client.chat.completions.create({
      messages: messagesWithSystem,
      model: "deepseek-ai/DeepSeek-V3"
    });

    const reply = response.choices?.[0]?.message?.content || '[No reply]';
    let conversation;

    // Save only the last exchange for storage
    const userMessage = lastMessage.content;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.messages.push({ prompt: userMessage, response: reply });
        await conversation.save();
      }
    }

    // If no conversation or invalid ID, create new
    if (!conversation) {
      conversation = new Conversation({
        userId,
        title: userMessage.slice(0, 30),
        messages: [{ prompt: userMessage, response: reply }]
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
  console.log('🔧 PATCH route hit!', {
    id: req.params.id,
    body: req.body,
    headers: req.headers
  });
  
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    if (!title) {
      console.log('❌ No title provided');
      return res.status(400).json({ error: 'Title is required' });
    }
    
    console.log('🔍 Looking for conversation with ID:', id);
    const updated = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
    
    if (!updated) {
      console.log('❌ Conversation not found');
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    console.log('✅ Conversation updated:', updated);
    res.json(updated);
  } catch (error) {
    console.error('❌ Error in PATCH route:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// 🗂️ Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// 📎 POST /chat/upload — Upload file and ask about it
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const { conversationId, followupQuestion } = req.body;
  const userId = req.user?.id;
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  let extractedText = '';
  const ext = path.extname(file.originalname).toLowerCase();

  try {
    // 🧠 Extract text based on file type
    if (ext === '.pdf') {
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const ocrResult = await Tesseract.recognize(file.path, 'eng');
      extractedText = ocrResult.data.text;
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ error: 'No text found in file' });
    }

    // 🤖 Ask Together AI about the extracted content
    const client = getTogetherClient();
    const messages = [
      { role: 'system', content: 'You are a helpful assistant. Answer based on the file content provided.' },
      { role: 'user', content: `Here is the content of the uploaded file:\n\n${extractedText}` }
    ];

    if (followupQuestion) {
      messages.push({ role: 'user', content: followupQuestion });
    }

    const response = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-V3',
      messages
    });

    const reply = response.choices?.[0]?.message?.content || '[No reply]';

    // 💾 Save to conversation if exists
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (conversation) {
        conversation.messages.push({
          prompt: `📎 Uploaded: ${file.originalname}${followupQuestion ? `\n❓ ${followupQuestion}` : ''}`,
          response: reply
        });
        await conversation.save();
      }
    }

    res.json({ reply, fileName: file.originalname });
  } catch (err) {
    console.error('❌ File processing error:', err.message || err);
    res.status(500).json({ error: 'Failed to process uploaded file' });
  }
});

export default router;
