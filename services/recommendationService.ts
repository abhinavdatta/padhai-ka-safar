import { StudentProfile, Scholarship, Course, EducationLevel, IncomeRange } from '../types';

/**
 * RULE ENGINE (EXPLAINABLE LOGIC)
 * 
 * This file replaces "Black Box AI". It contains deterministic rules 
 * to match students with government schemes based on the profile data.
 */

// --- DATABASE SIMULATION (CONSTANTS) ---

const SCHOLARSHIP_DB: Scholarship[] = [
  {
    id: "NSP-001",
    name: "Post Matric Scholarship Scheme for Minorities",
    provider: "Ministry of Minority Affairs",
    amount: "₹12,000 / year",
    deadline: "2024-10-31",
    eligibilityDescription: "Income < 2L, Scored > 50% in prev exam",
    tags: ["Minority", "Needs-based"]
  },
  {
    id: "NSP-002",
    name: "Central Sector Scheme of Scholarship",
    provider: "Department of Higher Education",
    amount: "₹10,000 - ₹20,000 / year",
    deadline: "2024-11-15",
    eligibilityDescription: "Top 20th Percentile in Class 12",
    tags: ["Merit-based", "UG", "PG"]
  },
  {
    id: "AICTE-001",
    name: "Pragati Scholarship Scheme",
    provider: "AICTE",
    amount: "₹50,000 / year",
    deadline: "2024-12-01",
    eligibilityDescription: "Girl students admitted to Diploma/Degree",
    tags: ["Women", "Technical"]
  },
  {
    id: "ST-001",
    name: "Pre-Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice",
    amount: "₹3,500 / year",
    deadline: "2024-09-30",
    eligibilityDescription: "Parental Income < 2.5L",
    tags: ["SC", "School"]
  }
];

const COURSE_DB: Course[] = [
  {
    id: "SW-01",
    title: "Introduction to Python Programming",
    platform: "SWAYAM",
    duration: "8 Weeks",
    certification: true,
    category: "Computer Science"
  },
  {
    id: "NSDC-01",
    title: "Data Entry Operator Qualification",
    platform: "NSDC",
    duration: "12 Weeks",
    certification: true,
    category: "Vocational"
  },
  {
    id: "NPTEL-01",
    title: "Soft Skills for Business Negotiations",
    platform: "NPTEL",
    duration: "4 Weeks",
    certification: false,
    category: "Management"
  },
  {
    id: "SI-01",
    title: "Electric Vehicle Technician",
    platform: "Skill India",
    duration: "6 Months",
    certification: true,
    category: "Technical"
  }
];

// --- LOGIC FUNCTIONS ---

export const getEligibleScholarships = (profile: StudentProfile): Scholarship[] => {
  const eligible: Scholarship[] = [];
  const income = profile.incomeRange;
  const edu = profile.educationLevel;

  // RULE 1: Low Income Support
  if (income === IncomeRange.BELOW_1L || income === IncomeRange.BETWEEN_1L_2_5L) {
    eligible.push(SCHOLARSHIP_DB.find(s => s.id === "NSP-001")!);
    eligible.push(SCHOLARSHIP_DB.find(s => s.id === "ST-001")!);
  }

  // RULE 2: Higher Education Support
  if (edu === EducationLevel.UG || edu === EducationLevel.PG) {
    eligible.push(SCHOLARSHIP_DB.find(s => s.id === "NSP-002")!);
  }

  // RULE 3: Technical/Diploma Support
  if (edu === EducationLevel.DIPLOMA || edu === EducationLevel.UG) {
    eligible.push(SCHOLARSHIP_DB.find(s => s.id === "AICTE-001")!);
  }

  // Deduplicate and return
  return [...new Set(eligible)].filter(Boolean);
};

export const getRecommendedCourses = (profile: StudentProfile): Course[] => {
  // Simple matching based on education level
  if (profile.educationLevel === EducationLevel.SCHOOL_10 || profile.educationLevel === EducationLevel.SCHOOL_12) {
     return COURSE_DB.filter(c => c.category === "Vocational" || c.platform === "Skill India");
  }
  
  if (profile.educationLevel === EducationLevel.UG || profile.educationLevel === EducationLevel.PG) {
    return COURSE_DB.filter(c => c.category === "Computer Science" || c.category === "Management");
  }

  return COURSE_DB; // Fallback
};

export const getNextSteps = (level: EducationLevel): string[] => {
  switch (level) {
    case EducationLevel.SCHOOL_10:
      return ["Explore Diploma Courses in Engineering", "Prepare for Higher Secondary (Science/Commerce/Arts)"];
    case EducationLevel.SCHOOL_12:
      return ["Apply for Undergraduate Programs (CUET)", "Check Vocational Training on Skill India"];
    case EducationLevel.DIPLOMA:
      return ["Lateral Entry to B.Tech", "Apprenticeship under NAPS"];
    case EducationLevel.UG:
      return ["Post Graduate Entrance Exams (GATE/CAT)", "Industry Certification Courses"];
    default:
      return ["Upskilling", "Certification"];
  }
};