import { compileResume } from "../src/lib/compile-resume";
import assert from "assert";

const profile = {
  full_name: "Maria Reyes",
  email: "maria@test.com",
  phone: "+63 917 555 0142",
  location: "Quezon City",
  linkedin: "linkedin.com/in/mariareyes",
  target_role: "Customer Success Lead",
};

const session = {
  jobs: [
    { id: "j1", role: "Team Lead", company: "Lumi", dates: "2023-Present", level: 2, mined: {} as any },
  ],
  bullets: {
    j1: [{ id: "b1", jobId: "j1", text: "Led 12-person team", level: 2, fresh: false }],
  },
};

const analysis = {
  is_resume: true,
  summary: "CS professional with 5+ years",
  experiences: [
    { role: "Team Lead", company: "Lumi", dates: "2023-Present", description: "Managed team" },
    { role: "Specialist", company: "Acenture", dates: "2020-2023", description: "Handled tickets" },
  ],
  major_issues: [],
  minor_issues: [],
  positives: [],
};

// Test 1: Full data
const full = compileResume(profile, session, analysis as any);
assert.strictEqual(full.name, "Maria Reyes");
assert.strictEqual(full.experience.length, 2);
assert.strictEqual(full.experience[0].bullets[0], "Led 12-person team");
assert.strictEqual(full.experience[1].bullets[0], "Handled tickets");
assert.strictEqual(full.summary, "CS professional with 5+ years");
console.log("✓ Test 1: full data merge");

// Test 2: Missing bullets falls back to analysis
const noBullets = compileResume(profile, { jobs: session.jobs, bullets: {} }, analysis as any);
assert.strictEqual(noBullets.experience[0].bullets[0], "Managed team");
console.log("✓ Test 2: fallback to analysis description");

// Test 3: No session
const noSession = compileResume(profile, null, null);
assert.strictEqual(noSession.name, "Maria Reyes");
assert.strictEqual(noSession.experience.length, 0);
assert.strictEqual(noSession.title, "Customer Success Lead");
console.log("✓ Test 3: null session handling");

// Test 4: Missing profile fields
const sparseProfile = { full_name: null, email: null, phone: null, location: null, linkedin: null, target_role: null };
const sparse = compileResume(sparseProfile as any, session, null);
assert.strictEqual(sparse.name, "");
assert.strictEqual(sparse.title, "Team Lead"); // falls back to first job role
console.log("✓ Test 4: missing profile fields");

console.log("\nAll compileResume tests passed!");
