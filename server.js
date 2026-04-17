import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const portfolioContext = `
BRAMMA SAKTHI P
Contact: (312)-599-1005 | brammasakthip@gmail.com | LinkedIn: linkedin.com/in/brammasakthi

PROFESSIONAL SUMMARY
Product professional with 8+ years of experience delivering digital solutions across Amazon and TCCI, including 2 years in product management. Led product discovery and cross-functional delivery, improving user satisfaction (3.0 → 4.2), reducing work order approval time by 60%, and automating 80% of workflows. Strong focus on building scalable, user-centered products that drive measurable business outcomes.

CORE COMPETENCIES
Product Management | Product Discovery | Roadmapping | Backlog Prioritization | User Stories & Acceptance Criteria | Agile | Stakeholder Management | Cross-Functional Collaboration | User Research | Data Analysis | SQL | Python | Power BI | Tableau | JIRA | AI & Automation (LLM workflows, n8n, Lovable, API integrations)

WORK EXPERIENCE

Business Analyst – Digital Transformation & Automation | TCCI, IL (APR 2023-JUN 2025)
• Led product discovery and stakeholder interviews across Operations, Finance, Lab, and Leadership; translated requirements into prioritized backlog, user stories, and acceptance criteria.
• Owned end-to-end work order platform lifecycle (500+ monthly requests), reducing approval cycle time by 60% through workflow redesign and user-centered improvements to intake, tracking & visibility.
• Identified duty drawback process gap & delivered automation solution, enabling $700K revenue recovery.
• Designed and launched a Power Apps platform replacing manual production and quality check-sheets, digitizing 80% of operational processes, including purchase requisition and barcode printing apps.
• Served as data owner during NAV → Azure ERP migration, ensuring data integrity across data.
• Built Power BI dashboards to support data-driven decision-making in purchasing and inventory planning.

Consultant Intern | TCCI, IL (AUG 2022-DEC 2022)
• Analyzed manufacturing client data and federal tax incentives to support electrification strategy and inform executive investment decisions.
• Built a 500+ prospect sales database using Sales Navigator to support target market expansion.

Senior Associate, Quality Services | Amazon, India (SEP 2014-NOV 2019)
• Built 10+ Tableau dashboards for FireTV QA and defect tracking, consolidating testing and defect data to improve visibility into release readiness and reduce manual reporting by 10 hours per week.
• Analyzed FireTV customer reviews using AWS Redshift and S3, identifying drivers of low ratings and supporting improvements that increased ratings from 3 → 4+ stars.
• Received Innovation Champion Award for automating privacy leak analysis using Python, reducing manual effort from 120 hours to 10 minutes per week.

PERSONAL PROJECTS

Trajectory (Hackathon Winner) | Women in Product
Designed and built mentor-mentee matching application during hackathon; conducted user research on matching criteria (career goals, experience level, domain), designed matching logic & delivered functional prototype, selected as winning solution under consideration for community implementation.

AI Meal Planner | Product Prototype
Built Streamlit-based product generating personalized weekly meal plans and automated grocery lists. Designed end-to-end product flow from user input to AI-generated recommendations, improving user experience and reducing planning friction.

AI Ad Builder (Lovable + n8n) | Volunteer
Built AI workflow generating ad copy and images using N8N, Lovable, OpenAI and Replicate APIs. Supported participants in live session by debugging workflows and enabling end-to-end execution.

EDUCATION
MS in Management Information Systems | Northern Illinois University, USA | GPA 3.6/4 (2021-2022)
B. Tech in Information Technology | Anna University, India | GPA 3.5/4 (2010-2014)

LOCATION & BACKGROUND
Currently based in Bolingbrook, Illinois. Active in Women in Product community. Transitioning into AI PM roles and building ClearVoice (AI-powered feedback analyzer for small businesses).

PORTFOLIO & LINKS
Website: https://brammasakthi.com
LinkedIn: https://www.linkedin.com/in/brammasakthi/
Medium: https://medium.com/@brammasakthip
Tableau: https://public.tableau.com/app/profile/bramma.sakthi.panneerkai.perumal/vizzes
GitHub: https://github.com/brammap
Email: brammasakthip@gmail.com
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1',
        max_tokens: 500,
        system: `You are Aura, Sakthi's AI assistant. Answer questions about her work, experience, capabilities, and background based on the information provided. Be conversational, helpful, and concise. If someone asks how to contact her, mention the form on the portfolio, LinkedIn, or email. Here's Sakthi's complete information:\n\n${portfolioContext}`,
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
    res.json({ message: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Chatbot backend running on http://localhost:${PORT}`);
});
