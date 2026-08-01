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
    temperature: 0.7,
  });

  return response.choices[0].message.content
    .replace(/```json|```/g, "")
    .trim();
};

const getRecommendations = async (answers) => {
  const prompt = `
You are an expert career advisor.

Based on this profile:

Age: ${answers.ageGroup}
Status: ${answers.currentStatus}
Interests: ${(answers.interests || []).join(", ")}
Skills: ${(answers.skills || []).join(", ")}
Experience: ${answers.experience}
Budget: ${answers.budget}
Work Preference: ${answers.workPreference}
Work Mode: ${answers.workMode}
Income Goal: ${answers.incomeGoal}
Risk: ${answers.riskLevel}
Personality: ${answers.personality}
Resources: ${(answers.resources || []).join(", ")}

Return ONLY valid JSON.

Return an array of exactly 5 opportunities.

Each object must contain:

{
"title":"",
"category":"",
"matchScore":90,
"why":"",
"startupCost":"",
"earningPotential":""
}
`;

  const text = await callAI(prompt);
  const recommendations = JSON.parse(text);

  return recommendations.map((r, index) => ({
    id: index + 1,
    ...r,
  }));
};

const generateRoadmap = async (answers, opportunity) => {
  const prompt = `
Create a personalized roadmap for

"${opportunity.title}"

User profile:

Status: ${answers.currentStatus}
Experience: ${answers.experience}
Budget: ${answers.budget}
Skills: ${(answers.skills || []).join(", ")}
Interests: ${(answers.interests || []).join(", ")}
Resources: ${(answers.resources || []).join(", ")}
Goal: ${answers.incomeGoal}
Risk: ${answers.riskLevel}

Return ONLY JSON.

Example:

[
{
"title":"Step 1",
"description":"..."
}
]
`;

  const text = await callAI(prompt);

  return JSON.parse(text);
};

module.exports = {
  getRecommendations,
  generateRoadmap,
};