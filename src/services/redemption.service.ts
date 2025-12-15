import { StorageService } from './storage.service';
import { Redemption } from '../models/redemption.model';
import { ValidationError, TeamNameNotFoundError, AlreadyRedeemedError } from '../errors/errors';

export class RedemptionService {
  constructor(private storage: StorageService) {}

  checkEligibility(teamName: string): boolean {
    const redemption: Redemption | null = this.storage.findRedemption(teamName);

    // Not eligible: Record exists
    if (redemption !== null) {
      throw new AlreadyRedeemedError(teamName, redemption.staff_pass_id)
    }

    else {
      return true;
    }
  }
}