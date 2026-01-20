// Enums for Dropdowns
export enum EducationLevel {
  SCHOOL_10 = "Class 10",
  SCHOOL_12 = "Class 12",
  DIPLOMA = "Diploma",
  UG = "Undergraduate",
  PG = "Postgraduate"
}

export enum State {
  DELHI = "Delhi",
  MAHARASHTRA = "Maharashtra",
  UTTAR_PRADESH = "Uttar Pradesh",
  KARNATAKA = "Karnataka",
  OTHER = "Other"
}

export enum IncomeRange {
  BELOW_1L = "Below 1 Lakh",
  BETWEEN_1L_2_5L = "1 Lakh - 2.5 Lakhs",
  BETWEEN_2_5L_8L = "2.5 Lakhs - 8 Lakhs",
  ABOVE_8L = "Above 8 Lakhs"
}

// User Profile (Privacy Preserved: No Aadhaar Number stored here)
export interface StudentProfile {
  verificationToken: string; // Token from Mock UIDAI
  name: string; // Retrieved via KYC
  educationLevel: EducationLevel;
  state: State;
  district: string;
  incomeRange: IncomeRange;
  interests: string[];
}

// Domain Models
export interface Scholarship {
  id: string;
  name: string;
  provider: string; // e.g., "MoE", "State Govt"
  amount: string;
  deadline: string;
  eligibilityDescription: string;
  tags: string[];
}

export interface Course {
  id: string;
  title: string;
  platform: "SWAYAM" | "NPTEL" | "Skill India" | "NSDC";
  duration: string;
  certification: boolean;
  category: string;
}

export interface AadhaarResponse {
  success: boolean;
  token?: string;
  user_data?: {
    name: string;
    state: string; // Mock KYC data
  };
  message?: string;
}
