import { StorageService } from './storage.service';
import { Redemption } from '../models/redemption.model';
import { AlreadyRedeemedError } from '../errors/alreadyRedeemedError';
import { StaffPassNotFoundError } from '../errors/staffPassNotFoundError';

export class RedemptionService {
  constructor(private storage: StorageService) {}

  // Function 2: Check Eligibility
  checkEligibility(teamName: string): boolean {
    const redemption = this.storage.findRedemption(teamName);
    return redemption === null; // Eligible if no redemption exists
  }
  
}