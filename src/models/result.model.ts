
export interface BaseResult {
  message: string;
}

export interface EligibleResult extends BaseResult {
  eligible: boolean;
}

export interface RedemptionResult extends BaseResult{
  redeemed: boolean;
}