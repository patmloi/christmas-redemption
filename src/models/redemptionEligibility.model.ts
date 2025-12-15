
export interface EligibleResult {
  eligible: true;
  redeemedByStaffPassId?: undefined; 
}

export interface NotEligibleResult {
  eligible: false;
  redeemedByStaffPassId: string; 
}

export type EligibilityResult = EligibleResult | NotEligibleResult;