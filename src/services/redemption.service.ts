import { StorageService } from './storage.service';
import { StaffService } from './staff.service';
import { Redemption } from '../models/redemption.model';
import { EligibleResult, RedemptionResult } from '../models/result.model';


export class RedemptionService {
  constructor(
    private storage: StorageService,
    private staffService: StaffService
  ) {}

  checkEligibility(teamName: string): EligibleResult {
    const redemption: Redemption | null = this.storage.findRedemption(teamName);

    if (redemption) {
      const notEligibleMsg = `Team ${redemption.team_name} has already redeemed their Christmas gift. Previous redemption by ${redemption.staff_pass_id} at ${redemption.redeemed_at}.`
      const notEligibleRes: EligibleResult = {
        eligible: false,
        message: notEligibleMsg
      }
      return notEligibleRes;
    }
    else {
      const eligibleMsg = `Team ${teamName} has not yet redeemed their Christmas gift.`
      const eligibleRes: EligibleResult = {
        eligible: true,
        message: eligibleMsg
      }
      return eligibleRes;
    }
  }

  redeem(staffPassId: string): EligibleResult | RedemptionResult {
      // Intial checks
      const staff = this.staffService.lookup(staffPassId); 

      // Check eligibility and implement redemption at the same time (via transaction)
      // This prevents race condition, where two people from the same team try to redeem
      // and both would be considered valid to redeem, but the second person cannot actually redeem due to atomicity.

      // Transaction exposed and executed here to separate SQL and business logic
      const eligibleResult = this.storage.executeTransaction(() => {
        const existingRedemption = this.checkEligibility(staff.team_name);
        if (existingRedemption.eligible) {
          const redeemedAt = Date.now();
          this.storage.createRedemption(staffPassId, redeemedAt);
        }
        else {
          return existingRedemption;
        }
      });

      if (eligibleResult?.eligible === false) {
        return eligibleResult;
      }
      
      // Return redemption result by retriving newly created valid transaction

      const newlyRedeemed = this.storage.findRedemption(staff.team_name)
      if (newlyRedeemed) {
        const redeemedMsg = `${newlyRedeemed.staff_pass_id} successfully redeemed for ${newlyRedeemed.team_name}.`
        const redeemedRes: RedemptionResult = {
          redeemed: true, 
          message: redeemedMsg
        };
        return redeemedRes;
      }
      else {
        const notRedeemedMsg = `${staff.staff_pass_id} redemption for ${staff.team_name} failed. Please try again.`
        const notRedeemedRes: RedemptionResult = {
          redeemed: true, 
          message: notRedeemedMsg
        };
        return notRedeemedRes;
      }
  }
}