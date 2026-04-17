const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Portfolio context
const portfolioContext = `
Sakthi is a product manager and builder with 8+ years of professional experience, including 2 years dedicated PM experience. 

Key expertise:
- Product Strategy & Delivery
- Product UX & Systems Design
- Data & Product Insights
- Workflows & Tools

Recent work includes:
1. Turned fragmented data into $700K capital recovery at TCCI Manufacturing through data pipeline and Python automation
2. Digitized 80%+ of operational processes using Power Apps, SharePoint, and Power Automate
3. Analyzed customer feedback on Amazon Fire TV products to identify and fix critical issues
4. Won Women in Product Hackathon 2026 with a mentorship matching platform
5. Designed workflow systems that reduced approval times by 60%

Background:
- Currently on career break, actively transitioning into AI PM roles
- Building ClearVoice (AI-powered feedback analyzer for small businesses)
- Based in Bolingbrook, Illinois
- Active in Women in Product community
- Portfolio: https://brammasakthi.com

To contact: Use the form on the portfolio or reach out via LinkedIn (linkedin.com/in/brammasakthi) or email (brammasakthip@gmail.com)
`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `You are Sakthi's portfolio assistant. Answer questions about her work, experience, and capabilities. Be conversational, helpful, and concise. If someone asks how to contact her, mention the form on the portfolio, LinkedIn, or email. Here's context about Sakthi:\n\n${portfolioContext}`,
        messages: [
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Claude API error:', data);
      return res.status(response.status).json({ error: 'Failed to get response from AI' });
    }

    const assistantMessage = data.content[0].text;
    res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Chatbot backend running on http://localhost:${PORT}`);
});
