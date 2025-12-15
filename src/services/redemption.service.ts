import { StorageService } from './storage.service';
import { Redemption } from '../models/redemption.model';
import { EligibleResult, NotEligibleResult, EligibilityResult } from '../models/redemptionEligibility.model';

export class RedemptionService {
  constructor(private storage: StorageService) {}

  checkEligibility(teamName: string): EligibilityResult {
  const redemption: Redemption | null = this.storage.findRedemption(teamName);

  // Not eligible: Record exists
  if (redemption !== null) {
    return {
      eligible: false, 
      redeemedByStaffPassId: redemption.staff_pass_id,
    } as NotEligibleResult;
  }

  // Eligible: Record does not exist
  return {
    eligible: true, 
  } as EligibleResult;
}

  
}