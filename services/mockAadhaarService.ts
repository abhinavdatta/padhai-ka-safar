import { AadhaarResponse } from '../types';

/**
 * MOCK UIDAI SERVICE
 * 
 * In a real implementation, this would communicate with the UIDAI ASA/KSA using 
 * XML encryption and digital signatures.
 * 
 * STRICT PRIVACY RULE: This service verifies identity but ensures the frontend
 * never persists the Aadhaar number.
 */

// Simulating network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockAadhaarService = {
  
  /**
   * Step 1: Send OTP
   * Triggers OTP to the registered mobile number linked to Aadhaar.
   */
  sendOtp: async (aadhaarNumber: string): Promise<{ success: boolean; message: string }> => {
    await delay(1500); // Simulate API latency
    
    // Basic validation (Verhoeff algorithm simulation)
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return { success: false, message: "Invalid Aadhaar Number format." };
    }

    // Simulate OTP sent
    return { success: true, message: "OTP sent to registered mobile ending in ******1234" };
  },

  /**
   * Step 2: Verify OTP
   * Returns a verification token and minimal KYC data (Name, State).
   */
  verifyOtp: async (otp: string): Promise<AadhaarResponse> => {
    await delay(1500);

    // Mock Demo Login Logic
    if (otp === "123456") {
      return {
        success: true,
        token: `VERIFIED_UID_${Date.now()}_SECURE`,
        user_data: {
          name: "Rahul Kumar",
          state: "Delhi"
        }
      };
    } else {
      return { success: false, message: "Incorrect OTP. Please try again." };
    }
  }
};