const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const callAI = async (prompt) => {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
  });

  return response.choices[0].message.content
    .replace(/```json|```/g, "")
    .trim();
};

const getRecommendations = async (answers) => {
  const prompt = `
You are an expert career advisor and business mentor.

Based on the user's profile below, recommend EXACTLY 5 realistic income opportunities or small businesses.

USER PROFILE

Age Group: ${answers.ageGroup}
Current Status: ${answers.currentStatus}
Interests: ${(answers.interests || []).join(", ")}
Skills: ${(answers.skills || []).join(", ")}
Experience Level: ${answers.experience}
Budget: ${answers.budget}
Work Preference: ${answers.workPreference}
Work Mode: ${answers.workMode}
Income Goal: ${answers.incomeGoal}
Risk Tolerance: ${answers.riskLevel}
Personality: ${answers.personality}
Resources: ${(answers.resources || []).join(", ")}

INSTRUCTIONS

1. Return EXACTLY 5 opportunities.
2. Rank from BEST fit to LOWEST fit.
3. Use realistic opportunities.
4. Don't repeat similar ideas.
5. Explain WHY each opportunity suits THIS user.
6. Mention the user's actual interests, skills, experience, budget or goal.
7. Give realistic startup costs.
8. Give realistic monthly earning potential.

MATCH SCORE RULES

- Best fit: 92-98
- Very Good: 85-91
- Good: 75-84
- Average: 65-74
- Weak: 50-64

IMPORTANT

- Every matchScore MUST be different.
- Do NOT use the same score twice.
- Higher ranked opportunity MUST have higher score.
- Return ONLY VALID JSON.
- No markdown.
- No explanation.

Format:

[
  {
    "title":"",
    "category":"",
    "matchScore":95,
    "why":"",
    "startupCost":"",
    "earningPotential":""
  }
]
`;

  const text = await callAI(prompt);

  let recommendations = JSON.parse(text);

  if (!Array.isArray(recommendations)) {
    throw new Error("AI did not return an array.");
  }

  recommendations = recommendations.slice(0, 5);

  return recommendations.map((item, index) => ({
    id: index + 1,
    title: item.title,
    category: item.category,
    matchScore: Number(item.matchScore),
    why: item.why,
    startupCost: item.startupCost,
    earningPotential: item.earningPotential,
  }));
};

const generateRoadmap = async (answers, opportunity) => {
  const prompt = `
You are an expert mentor.

Create a PERSONALIZED roadmap for:

"${opportunity.title}"

USER PROFILE

Current Status: ${answers.currentStatus}
Experience: ${answers.experience}
Budget: ${answers.budget}
Skills: ${(answers.skills || []).join(", ")}
Interests: ${(answers.interests || []).join(", ")}
Resources: ${(answers.resources || []).join(", ")}
Income Goal: ${answers.incomeGoal}
Risk Tolerance: ${answers.riskLevel}
Personality: ${answers.personality}

RULES

1. Return 5-6 actionable steps.
2. Every step must reference the user's profile.
3. Mention their existing skills whenever possible.
4. Mention their budget where relevant.
5. Avoid generic advice.
6. Keep descriptions concise.

Return ONLY VALID JSON.

Example:

[
  {
    "title":"Learn the Market",
    "description":"Use your content writing skills to research..."
  }
]
`;

  const text = await callAI(prompt);

  const roadmap = JSON.parse(text);

  if (!Array.isArray(roadmap)) {
    throw new Error("AI did not return a valid roadmap.");
  }

  return roadmap;
};

module.exports = {
  getRecommendations,
  generateRoadmap,
};