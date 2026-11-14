const OpenAI = require("openai");

const getClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured in the server environment.");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

const sanitize = (val, maxLen = 120) => {
  if (typeof val !== "string") return "";
  return val.replace(/[\r\n`$]/g, " ").trim().slice(0, maxLen);
};

const sanitizeArray = (arr, maxItems = 10, maxLen = 80) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((item) => typeof item === "string")
    .map((item) => sanitize(item, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
};

const extractJSON = (content) => {
  if (!content) throw new Error("Empty response from AI");
  const clean = content.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    const arrayMatch = clean.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch (err) {}
    }
    const objMatch = clean.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[0]);
      } catch (err) {}
    }
    throw new Error("AI returned invalid JSON: " + clean.slice(0, 100));
  }
};

const callAI = async (prompt) => {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.6,
  });

  return response.choices[0]?.message?.content || "";
};

const getRecommendations = async (rawAnswers = {}) => {
  const answers = {
    ageGroup: sanitize(rawAnswers.ageGroup, 40) || "18-24",
    currentStatus: sanitize(rawAnswers.currentStatus, 50) || "Student",
    interests: sanitizeArray(rawAnswers.interests),
    skills: sanitizeArray(rawAnswers.skills),
    experience: sanitize(rawAnswers.experience, 50) || "Beginner",
    availableTime: sanitize(rawAnswers.availableTime, 40) || "1-3 hours",
    incomeGoal: sanitize(rawAnswers.incomeGoal, 50) || "Side Income",
    budget: sanitize(rawAnswers.budget, 40) || "₹0",
    workPreference: sanitize(rawAnswers.workPreference, 40) || "Independently",
    workMode: sanitize(rawAnswers.workMode, 40) || "Online",
    riskLevel: sanitize(rawAnswers.riskLevel, 30) || "Low",
    personality: sanitize(rawAnswers.personality, 50) || "Problem Solver",
    resources: sanitizeArray(rawAnswers.resources),
  };

  const prompt = `
You are an expert career advisor, entrepreneur mentor, and opportunity matching AI.
Your job is to recommend EXACTLY 5 realistic income opportunities or small business paths based on the user's profile.

USER PROFILE:
- Age Group: ${answers.ageGroup}
- Current Status: ${answers.currentStatus}
- Interests: ${answers.interests.join(", ") || "General"}
- Current Skills: ${answers.skills.join(", ") || "Beginner"}
- Experience Level: ${answers.experience}
- Available Daily Time: ${answers.availableTime}
- Income Goal: ${answers.incomeGoal}
- Initial Investment Budget: ${answers.budget}
- Work Preference: ${answers.workPreference}
- Work Mode: ${answers.workMode}
- Risk Level: ${answers.riskLevel}
- Personality: ${answers.personality}
- Available Resources: ${answers.resources.join(", ") || "Smartphone & Internet"}

MATCHING RULES:
1. Recommend opportunities suitable for THIS exact person.
2. If budget is ₹0: strictly no upfront capital required.
3. If user selected Online: prioritize remote / digital options.
4. If beginner: suggest skill-based paths with clear zero-to-one learning curve.
5. Rank from strongest match to weakest match with unique match scores (between 70 and 98).
6. Return ONLY a valid JSON array of 5 objects.

Format:
[
  {
    "title": "Short Opportunity Name",
    "category": "Freelance / Creator / Service / Digital Product",
    "matchScore": 95,
    "why": "Specific one-sentence reason why this matches their skills and constraints.",
    "startupCost": "₹0 or estimate",
    "earningPotential": "Realistic monthly range e.g. ₹15,000 - ₹40,000 / month"
  }
]
`;

  const text = await callAI(prompt);
  const recommendations = extractJSON(text);

  if (!Array.isArray(recommendations)) {
    throw new Error("AI response is not an array");
  }

  return recommendations.slice(0, 5).map((item, index) => ({
    id: index + 1,
    title: sanitize(item.title, 80) || `Opportunity ${index + 1}`,
    category: sanitize(item.category, 60) || "General",
    matchScore: Number(item.matchScore) || (95 - index * 5),
    why: sanitize(item.why, 240) || "Well-suited for your profile and schedule.",
    startupCost: sanitize(item.startupCost, 50) || answers.budget,
    earningPotential: sanitize(item.earningPotential, 60) || "₹10,000+ / month",
  }));
};

const generateRoadmap = async (rawAnswers = {}, rawOpportunity = {}) => {
  const opportunityTitle = sanitize(rawOpportunity.title, 80);
  if (!opportunityTitle) {
    throw new Error("Opportunity title is required to generate a roadmap.");
  }

  const answers = {
    currentStatus: sanitize(rawAnswers.currentStatus, 50) || "Professional",
    experience: sanitize(rawAnswers.experience, 50) || "Beginner",
    availableTime: sanitize(rawAnswers.availableTime, 40) || "1-3 hours",
    budget: sanitize(rawAnswers.budget, 40) || "₹0",
    skills: sanitizeArray(rawAnswers.skills),
    interests: sanitizeArray(rawAnswers.interests),
    resources: sanitizeArray(rawAnswers.resources),
    incomeGoal: sanitize(rawAnswers.incomeGoal, 50) || "Income",
    riskLevel: sanitize(rawAnswers.riskLevel, 30) || "Low",
    personality: sanitize(rawAnswers.personality, 50) || "Focused",
  };

  const prompt = `
You are an expert mentor.
Create a personalized 5-to-6 step action roadmap for:
"${opportunityTitle}"

USER PROFILE:
- Status: ${answers.currentStatus}
- Experience: ${answers.experience}
- Available Daily Time: ${answers.availableTime}
- Budget: ${answers.budget}
- Current Skills: ${answers.skills.join(", ") || "General"}
- Resources: ${answers.resources.join(", ") || "Smartphone & Internet"}

RULES:
1. Create 5-6 practical, sequential steps.
2. Step 1 should be Foundation / Learning (0 cost).
3. Step 2-3 should be Proof of Work / Portfolio / Validation.
4. Step 4-5 should be First Client / First Dollar / Launch.
5. Step 6 should be Scaling / Recurring Income.
6. Return ONLY a valid JSON array.

Format:
[
  {
    "title": "Action-oriented step title",
    "description": "Concrete 2-3 sentence guide on what to do, what tools to use, and how to measure completion."
  }
]
`;

  const text = await callAI(prompt);
  const roadmap = extractJSON(text);

  if (!Array.isArray(roadmap)) {
    throw new Error("Invalid roadmap format from AI");
  }

  return roadmap.slice(0, 6).map((step, idx) => ({
    title: sanitize(step.title, 90) || `Step ${idx + 1}`,
    description: sanitize(step.description, 400) || "Complete this milestone to progress.",
    done: false,
  }));
};

const getStepHelp = async ({ stepTitle, stepDescription, opportunityTitle, userQuestion }) => {
  const cleanStep = sanitize(stepTitle, 100);
  const cleanDesc = sanitize(stepDescription, 300);
  const cleanOpp = sanitize(opportunityTitle, 100);
  const cleanQ = sanitize(userQuestion, 200) || "How do I execute this milestone with 0 budget in 48 hours?";

  const prompt = `
You are an expert hands-on mentor.
A learner is working on the following career/business milestone:
- Opportunity: "${cleanOpp}"
- Milestone: "${cleanStep}"
- Milestone Details: "${cleanDesc}"
- User's Question / Roadblock: "${cleanQ}"

Provide direct, actionable, zero-fluff guidance.
Return ONLY valid JSON.

Format:
{
  "tldr": "One crisp sentence explaining the fastest way to unblock this step.",
  "actionItems": [
    "Specific task 1 (concrete instructions)",
    "Specific task 2",
    "Specific task 3"
  ],
  "freeTools": [
    { "name": "Free Tool 1", "purpose": "How to use it specifically for this step without paying" },
    { "name": "Free Tool 2", "purpose": "Free asset/resource for validation" }
  ],
  "pitfallToAvoid": "One common beginner mistake on this step to avoid."
}
`;

  const text = await callAI(prompt);
  const helpData = extractJSON(text);

  return {
    tldr: sanitize(helpData.tldr, 200) || "Break this into small 30-minute daily sprints.",
    actionItems: Array.isArray(helpData.actionItems)
      ? helpData.actionItems.map((a) => sanitize(a, 180)).slice(0, 4)
      : ["Set up your workspace", "Draft 1 proof of concept", "Get feedback"],
    freeTools: Array.isArray(helpData.freeTools)
      ? helpData.freeTools.slice(0, 3).map((t) => ({
          name: sanitize(t.name, 50) || "Free Tool",
          purpose: sanitize(t.purpose, 120) || "Free utility",
        }))
      : [{ name: "Notion / Google Docs", purpose: "Free planning and notes" }],
    pitfallToAvoid:
      sanitize(helpData.pitfallToAvoid, 200) ||
      "Do not spend money on premium tools or logos before getting your first customer.",
  };
};

const getPitchKit = async ({ opportunityTitle, category, skills = [] }) => {
  const cleanOpp = sanitize(opportunityTitle, 100);
  const cleanCat = sanitize(category, 60);
  const cleanSkills = sanitizeArray(skills).join(", ") || "General skills";

  const prompt = `
You are an elite sales coach and copywriter for modern freelancers and digital entrepreneurs.
Create an outreach and pitch kit for:
- Role/Opportunity: "${cleanOpp}" (${cleanCat})
- Core Skills: "${cleanSkills}"

Write a non-spammy, high-converting outreach kit to land their very first client or sale with ZERO ad spend.
Return ONLY valid JSON.

Format:
{
  "tagline": "One compelling headline for their LinkedIn / portfolio bio.",
  "coldEmail": {
    "subject": "Short catchy subject line (under 6 words)",
    "body": "Hi [Name],\\n\\nI noticed [Specific Observation about their product/content]. I put together a quick draft/sample showing how to [Specific Benefit without pitching yet].\\n\\nWould it be helpful if I sent over a 2-minute Loom breakdown or doc? No pressure at all.\\n\\nBest,\\n[Your Name]"
  },
  "dmScript": "Hi [Name] — love your work on [Topic]. Built a quick concept addressing [Problem]. Mind if I share a preview link?",
  "targetProspects": [
    "Where to find ideal leads (e.g. Subreddit r/startups, ProductHunt launches, Twitter search)",
    "Directory or platform to scout target clients",
    "Local business or niche community"
  ],
  "proTip": "One high-leverage tactical tip to get an 80%+ response rate."
}
`;

  const text = await callAI(prompt);
  const kitData = extractJSON(text);

  return {
    tagline: sanitize(kitData.tagline, 160) || `Helping companies scale through ${cleanOpp}.`,
    coldEmail: {
      subject: sanitize(kitData.coldEmail?.subject, 80) || `Quick idea for your team`,
      body: kitData.coldEmail?.body || "Hi [Name],\n\nI noticed your recent work. Would love to share a free draft.",
    },
    dmScript: sanitize(kitData.dmScript, 300) || "Hi [Name], saw your post. Put together a sample for you.",
    targetProspects: Array.isArray(kitData.targetProspects)
      ? kitData.targetProspects.map((p) => sanitize(p, 120)).slice(0, 3)
      : ["ProductHunt newly launched products", "LinkedIn founders posting about growth"],
    proTip:
      sanitize(kitData.proTip, 220) ||
      "Never ask for work upfront; show up with a pre-made sample or audit to demonstrate value first.",
  };
};

module.exports = {
  getRecommendations,
  generateRoadmap,
  getStepHelp,
  getPitchKit,
};