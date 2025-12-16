import { Request, Response, NextFunction } from 'express';
import { StaffService } from '../services/staff.service';
import { RedemptionService } from '../services/redemption.service';
import { validateStaffPassId } from '../validators/staffPassIdValidator';
import { ValidationError, TeamNameNotFoundError, AlreadyRedeemedError } from '../errors/errors';



export class RedemptionController {
  constructor(private staffService: StaffService, private redemptionService: RedemptionService) {}

  checkEligibility = (req: Request, res: Response, next: NextFunction): void => {
    try { 
      // Check if team name is a valid team name
      let { teamName } = req.params;
      teamName = String(teamName || '').trim();

      if (teamName === ''){
        throw new ValidationError('Team name cannot be an empty value.');
      }

      else if (!this.staffService.checkTeamNameExists(teamName)) {
        throw new TeamNameNotFoundError(teamName);
      }

      // Check if team name in redemptions
      const eligibleRes = this.redemptionService.checkEligibility(teamName);
      res.json(eligibleRes)
    } catch (error) {
      next(error)
    }
  };

  redeem = (req: Request, res: Response, next: NextFunction): void => {
    try { 
      let { staffPassId } = req.params;
      staffPassId = String(staffPassId).toUpperCase().trim();
      if (validateStaffPassId(staffPassId)){
        const redeemRes = this.redemptionService.redeem(staffPassId)
        res.json(redeemRes)
      }
    } catch (error) {
      next(error)
    }
  };
}