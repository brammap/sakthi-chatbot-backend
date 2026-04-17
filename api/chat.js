export default async function handler(req, res) {
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

    if (!message) return res.status(400).json({ error: 'Message required' });
    if (!apiKey) return res.status(500).json({ error: 'API key missing' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: 'You are Sakthi\'s AI assistant. Answer questions about her work, experience, and how to contact her.',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'API error' });

    res.status(200).json({ message: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
