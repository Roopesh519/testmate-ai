// qa-chatbot-backend/routes/settings.js
import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import crypto from 'crypto';

const router = express.Router();

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32); // 32 bytes key
const ALGORITHM = 'aes-256-cbc';

// Encrypt function
function encrypt(text) {
    const iv = crypto.randomBytes(16); // 16 bytes IV
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// Decrypt function
function decrypt(encryptedText) {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = textParts.join(':');
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// GET user settings
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId).select('username email createdAt togetherApiKey');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Don't send the actual API key, just indicate if it exists
        const hasApiKey = !!(user.togetherApiKey);

        res.json({
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            },
            hasApiKey
        });
    } catch (error) {
        console.error('❌ Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT update API key
router.put('/api-key', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { apiKey } = req.body;

        if (!apiKey || typeof apiKey !== 'string') {
            return res.status(400).json({ error: 'API key is required' });
        }

        // Basic validation for Together.ai API key
        const trimmedKey = apiKey.trim();
        if (trimmedKey.length < 10) {
            return res.status(400).json({ error: 'Invalid API key format' });
        }

        // Test the API key by making a simple request
        try {
            const testResponse = await fetch('https://api.together.xyz/v1/models', {
                headers: {
                    'Authorization': `Bearer ${trimmedKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!testResponse.ok) {
                return res.status(400).json({ error: 'Invalid API key. Please check your Together.ai API key.' });
            }
        } catch (testError) {
            console.error('❌ API key validation error:', testError);
            return res.status(400).json({ error: 'Failed to validate API key. Please try again.' });
        }

        // Encrypt and store the API key
        const encryptedApiKey = encrypt(trimmedKey);
        
        await User.findByIdAndUpdate(userId, {
            togetherApiKey: encryptedApiKey
        });

        res.json({ message: 'API key updated successfully' });
    } catch (error) {
        console.error('❌ Error updating API key:', error);
        res.status(500).json({ error: 'Failed to update API key' });
    }
});

// DELETE remove API key
router.delete('/api-key', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        
        await User.findByIdAndUpdate(userId, {
            $unset: { togetherApiKey: 1 }
        });

        res.json({ message: 'API key removed successfully' });
    } catch (error) {
        console.error('❌ Error removing API key:', error);
        res.status(500).json({ error: 'Failed to remove API key' });
    }
});

// Helper function to get user's API key (for use in other routes)
export async function getUserApiKey(userId) {
    try {
        const user = await User.findById(userId).select('togetherApiKey');
        if (user && user.togetherApiKey) {
            return decrypt(user.togetherApiKey);
        }
        return null; // Use system default
    } catch (error) {
        console.error('❌ Error getting user API key:', error);
        return null;
    }
}

export default router;