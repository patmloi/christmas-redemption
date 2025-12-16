
export interface EligibleResult {
  eligible: boolean;
  message: string;
}

export interface RedemptionResult {
  redeemed: boolean;
  message: string;
}

// export interface NotEligibleResult {
//   eligible: false;
//   redeemedByStaffPassId: string; 
// }

// export type EligibilityResult = EligibleResult | NotEligibleResult;