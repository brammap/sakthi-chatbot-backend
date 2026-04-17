const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'API key missing' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01' // ✅ REQUIRED
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // ✅ FAST (works on Vercel)
        max_tokens: 200,
        system: "You are Sakthi's AI assistant. Answer questions about her work and experience.",
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // Handle API errors properly
    if (!response.ok) {
      console.error('Claude API error:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Claude API error'
      });
    }

    // Safe extraction
    const reply = data?.content?.[0]?.text || "No response from AI";

    return res.status(200).json({ message: reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
};
