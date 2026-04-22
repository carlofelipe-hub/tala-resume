import { computeAtsScore } from "../src/lib/ats-score";
import assert from "assert";

const perfectData = {
  name: "Maria Reyes",
  title: "Customer Success Lead",
  email: "maria@test.com",
  phone: "+63 917 555 0142",
  location: "Quezon City",
  summary: "Customer success professional with 5+ years building support operations for SaaS teams.",
  experience: [
    {
      role: "Team Lead",
      company: "Lumi",
      dates: "2023-Present",
      bullets: [
        "Led a 12-person team serving 840 accounts",
        "Reduced ticket resolution time by 38%",
        "Launched bilingual onboarding playbook",
        "Improved NPS from 42 to 71",
      ],
    },
  ],
  education: [{ school: "University of Santo Tomas", degree: "B.A. Communication Arts", dates: "2015-2019" }],
  skills: ["Zendesk", "Intercom", "Salesforce", "Team Leadership", "SQL", "Onboarding Design"],
};

const classicSettings = { template: "classic", typography: "editorial", density: "regular", accent: "sun-gold", paper: "letter", language: "english" };

const result = computeAtsScore(perfectData as any, classicSettings as any);
assert(result.score >= 75, `Expected high score, got ${result.score}`);
assert(result.insight.includes("Excellent") || result.insight.includes("Good"));
console.log("✓ Perfect resume score:", result.score, result.insight);

const sparseData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
};

const sparseResult = computeAtsScore(sparseData as any, classicSettings as any);
assert(sparseResult.score < 40, `Expected low score, got ${sparseResult.score}`);
console.log("✓ Sparse resume score:", sparseResult.score, sparseResult.insight);

console.log("\nAll ATS score tests passed!");
