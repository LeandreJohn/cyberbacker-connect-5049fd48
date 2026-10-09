export type ExperienceTier = "beginner" | "intermediate" | "advanced";

export interface TierDefinition {
  label: string;
  experience: string;
  description: string;
  blurb: string;
}

export const EXPERIENCE_TIERS: Record<ExperienceTier, TierDefinition> = {
  beginner: {
    label: "Beginner",
    experience: "0–1 year",
    description: "Early-career talent ready for structured training and close guidance.",
    blurb: "We are looking for an early-career professional who is coachable, organized, and ready to learn our processes with structured support.",
  },
  intermediate: {
    label: "Intermediate",
    experience: "1–4 years",
    description: "Proven fundamentals with enough experience to own routine work.",
    blurb: "We are looking for a capable professional who can independently manage recurring work while learning the nuances of our business.",
  },
  advanced: {
    label: "Advanced",
    experience: "4+ years",
    description: "Deep experience and ready to lead the work with minimal ramp-up.",
    blurb: "We need an experienced professional who can take ownership quickly, improve the process, and deliver with minimal supervision.",
  },
};

export interface JobMatchProfile {
  title: string;
  industry: string;
  tier: ExperienceTier;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  deliverables: string[];
  tools: string[];
  timezone: string;
  availabilityHours: string;
  workStyle: string;
  language: string;
  certification: string;
}

export interface MatchableCandidate {
  title: string;
  yearsExperience: number;
  skills: string[];
  industries: string[];
  tools?: string[];
  timezone?: string;
  availabilityHours?: string[];
  workStyle?: string;
  languages?: string[];
  certifications?: string[];
}

export interface CandidateMatchResult {
  score: number;
  passesConstraints: boolean;
  strengths: string[];
  gaps: string[];
}

const SKILL_ALIASES: Record<string, string> = {
  "calendar management": "calendar",
  "email management": "inbox",
  "project management": "project mgmt",
  "customer service": "customer support",
  "transaction coordination": "transaction coordinator",
};

const normalizeTerm = (value: string) => SKILL_ALIASES[value.toLowerCase().trim()] ?? value.toLowerCase().trim();

const normalizedWords = (value: string) =>
  normalizeTerm(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !["management", "assistant", "specialist"].includes(word));

export function termsMatch(left: string, right: string) {
  const a = normalizeTerm(left);
  const b = normalizeTerm(right);
  if (!a || !b) return false;
  if (a.includes(b) || b.includes(a)) return true;
  const leftWords = normalizedWords(a);
  const rightWords = normalizedWords(b);
  return leftWords.some((word) => rightWords.includes(word));
}

export function tierExperienceMatches(tier: ExperienceTier, years: number) {
  if (tier === "beginner") return years >= 0 && years <= 1;
  if (tier === "intermediate") return years >= 1 && years <= 4;
  return years >= 4;
}

function arrayHasMatch(needles: string[], haystack: string[]) {
  return needles.filter((needle) => haystack.some((value) => termsMatch(needle, value)));
}

export function scoreCandidate(profile: JobMatchProfile, candidate: MatchableCandidate): CandidateMatchResult {
  const requiredHits = arrayHasMatch(profile.requiredSkills, candidate.skills);
  const preferredHits = arrayHasMatch(profile.preferredSkills, candidate.skills);
  const toolHits = arrayHasMatch(profile.tools, candidate.tools ?? candidate.skills);
  const tierPass = tierExperienceMatches(profile.tier, candidate.yearsExperience);
  const timezonePass = !profile.timezone || !candidate.timezone || termsMatch(profile.timezone, candidate.timezone);
  const hoursPass =
    !profile.availabilityHours ||
    !candidate.availabilityHours?.length ||
    candidate.availabilityHours.some((hours) => termsMatch(profile.availabilityHours, hours));
  const languagePass =
    !profile.language ||
    profile.language === "No preference" ||
    !candidate.languages?.length ||
    candidate.languages.some((language) => termsMatch(profile.language, language));
  const certificationPass =
    !profile.certification ||
    !candidate.certifications?.length ||
    candidate.certifications.some((certification) => termsMatch(profile.certification, certification));
  const workStylePass =
    !profile.workStyle || !candidate.workStyle || termsMatch(profile.workStyle, candidate.workStyle);
  const requiredPass = requiredHits.length === profile.requiredSkills.length;
  const passesConstraints = requiredPass && tierPass && timezonePass && hoursPass && languagePass && certificationPass;

  const skillScore = profile.requiredSkills.length
    ? (requiredHits.length / profile.requiredSkills.length) * 40
    : 40;
  const experienceScore = tierPass ? 25 : 0;
  const contextTerms = [...profile.responsibilities, ...profile.deliverables, profile.title, profile.industry];
  const contextHaystack = [candidate.title, ...candidate.skills, ...candidate.industries];
  const contextHits = arrayHasMatch(contextTerms, contextHaystack);
  const contextScore = contextTerms.length ? Math.min(20, (contextHits.length / contextTerms.length) * 20) : 20;
  const operationChecks = [timezonePass, hoursPass, workStylePass, languagePass, certificationPass];
  const operationsScore = (operationChecks.filter(Boolean).length / operationChecks.length) * 10;
  const preferencePool = profile.preferredSkills.length + profile.tools.length;
  const preferenceScore = preferencePool ? ((preferredHits.length + toolHits.length) / preferencePool) * 5 : 5;

  const strengths = [
    requiredHits.length ? `${requiredHits.length}/${profile.requiredSkills.length} required skills` : "Experience tier",
    tierPass ? `${candidate.yearsExperience} years of experience` : "",
    timezonePass && hoursPass ? "Schedule compatible" : "",
    preferredHits.length ? `${preferredHits.length} preferred skill${preferredHits.length === 1 ? "" : "s"}` : "",
  ].filter(Boolean).slice(0, 3);
  const gaps = [
    ...profile.requiredSkills.filter((skill) => !requiredHits.includes(skill)).map((skill) => `Missing ${skill}`),
    !tierPass ? `Outside ${EXPERIENCE_TIERS[profile.tier].experience}` : "",
    !timezonePass ? "Time zone mismatch" : "",
    !hoursPass ? "Coverage mismatch" : "",
    !languagePass ? "Language mismatch" : "",
    !certificationPass ? "Certification not listed" : "",
  ].filter(Boolean).slice(0, 3);

  return {
    score: Math.min(99, Math.round(skillScore + experienceScore + contextScore + operationsScore + preferenceScore)),
    passesConstraints,
    strengths,
    gaps,
  };
}