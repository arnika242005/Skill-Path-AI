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
You are an expert career advisor, entrepreneur mentor and opportunity matching AI.

Your job is to recommend EXACTLY 5 realistic income opportunities
or small business paths based on the user's profile.

USER PROFILE

Age Group: ${answers.ageGroup}
Current Status: ${answers.currentStatus}
Interests: ${(answers.interests || []).join(", ")}
Current Skills: ${(answers.skills || []).join(", ")}
Experience Level: ${answers.experience}
Available Daily Time: ${answers.availableTime}
Income Goal: ${answers.incomeGoal}
Initial Investment Budget: ${answers.budget}
Work Preference: ${answers.workPreference}
Work Mode: ${answers.workMode}
Risk Level: ${answers.riskLevel}
Personality: ${answers.personality}
Available Resources: ${(answers.resources || []).join(", ")}

IMPORTANT MATCHING RULES:

1. Recommend opportunities suitable for THIS exact person.
2. Consider their: skills, experience, budget, available time, personality, resources.
3. If user is beginner/student: prefer low-cost opportunities, avoid unrealistic businesses, suggest skill-based income paths
4. If budget is ₹0:
   - don't recommend businesses requiring investment.
5. If user selected Online:
   - prioritize online opportunities.
6. If user selected Independent:
   - prefer freelancing, solo work, digital businesses.
7. If user selected Team:
   - suggest collaboration-based opportunities.
8. Do not repeat similar opportunities.
9. Rank from strongest match to weakest match.

MATCH SCORE:
Best match: 92-98
Very good: 85-91
Good: 75-84
Average: 65-74
Rules:
- Every score must be unique.
- Higher ranking must have higher score.
Return ONLY JSON.
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

let recommendations;
try {
  recommendations = JSON.parse(text);
}
catch(err){
  throw new Error("AI returned invalid JSON");
}

if(!Array.isArray(recommendations)){
  throw new Error("AI response is not an array");
}

return recommendations.slice(0,5).map((item,index)=>({
id:index+1,
title:item.title,
category:item.category,
matchScore:Number(item.matchScore),
why:item.why,
startupCost:item.startupCost,
earningPotential:item.earningPotential
}));
};

const generateRoadmap = async (answers, opportunity)=>{
const prompt = `
You are an expert mentor.
Create a personalized action roadmap for:

${opportunity.title}


USER PROFILE

Current Status: ${answers.currentStatus}
Experience: ${answers.experience}
Available Time: ${answers.availableTime}
Budget: ${answers.budget}
Skills: ${(answers.skills || []).join(", ")}
Interests: ${(answers.interests || []).join(", ")}
Resources: ${(answers.resources || []).join(", ")}
Income Goal: ${answers.incomeGoal}
Risk Level: ${answers.riskLevel}
Personality: ${answers.personality}

RULES

1. Create 5-6 practical steps.
2. Steps should match:
- user's experience level
- available time
- budget
- skills
3. Avoid generic advice.
4. Mention user's existing skills where possible.
5. For beginners: start with learning + portfolio + first earning steps.
6. For freelancers: include finding clients and creating proof of work.
7. For business ideas: include validation before investment.
8. Keep descriptions short and actionable.

Return ONLY JSON.

Format:
[
 {
    "title":"Learn the Market",
    "description":"Use your content writing skills to research..."
 }
]
`;
const text = await callAI(prompt);
let roadmap;
try{
 roadmap = JSON.parse(text);
}
catch(err){
 throw new Error("AI returned invalid roadmap JSON");
}

if(!Array.isArray(roadmap)){
 throw new Error("Invalid roadmap format");
}

return roadmap;
};

module.exports = {
 getRecommendations,
 generateRoadmap,
};