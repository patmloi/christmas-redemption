import { StorageService } from './storage.service';
import { Redemption } from '../models/redemption.model';

export class StaffPassNotFoundError extends Error {
  constructor(staffPassId: string) {
    super(`Staff pass ID not found: ${staffPassId}`);
    this.name = 'StaffPassNotFoundError';
  }
}

export class AlreadyRedeemedError extends Error {
  constructor(teamName: string) {
    super(`Team has already redeemed: ${teamName}`);
    this.name = 'AlreadyRedeemedError';
  }
}

export class RedemptionService {
  constructor(private storage: StorageService) {}

  // Function 1: Lookup
  lookup(staffPassId: string): string {
    const staff = this.storage.findStaffByPassId(staffPassId);
    if (!staff) {
      throw new StaffPassNotFoundError(staffPassId);
    }
    return staff.team_name;
  }

  // Function 2: Check Eligibility
  checkEligibility(teamName: string): boolean {
    const redemption = this.storage.findRedemption(teamName);
    return redemption === null; // Eligible if no redemption exists
  }

  // Function 3: Redeem
  redeem(staffPassId: string): Redemption {
    // Lookup team
    const teamName = this.lookup(staffPassId);

    // Check eligibility
    if (!this.checkEligibility(teamName)) {
      throw new AlreadyRedeemedError(teamName);
    }

    // Create redemption
    const timestamp = Date.now();
    return this.storage.createRedemption(teamName, timestamp);
  }
}