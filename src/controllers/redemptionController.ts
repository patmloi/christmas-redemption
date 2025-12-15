import { Request, Response } from 'express';
import { StaffService } from '../services/staff.service';
import { RedemptionService } from '../services/redemption.service';
import { ValidationError, TeamNameNotFoundError, AlreadyRedeemedError } from '../errors/errors';



export class RedemptionController {
  constructor(private staffService: StaffService, private redemptionService: RedemptionService) {}

  checkEligibility = (req: Request, res: Response): void => {
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
      const eligibilityResult = this.redemptionService.checkEligibility(teamName);
      const { eligible, redeemedByStaffPassId } = eligibilityResult;

      if (eligible) {
        res.json({ 
          teamName: teamName, 
          eligible: true });
      } else {
        throw new AlreadyRedeemedError(teamName, redeemedByStaffPassId!); 
      }

    } catch (error) {
        // Validation error
        if (error instanceof ValidationError) {
            res.status(400).json({ 
                error: 'Validation Failed', 
                details: error.message 
            });
        }

        // Already redeemed error
        else if (error instanceof AlreadyRedeemedError) {
          res.status(403).json({ 
            message: error.message
          });
        }

        // Team not found error 
        else if (error instanceof TeamNameNotFoundError) {
          res.status(404).json({ 
            message: error.message
          });
        }

        else {
          res.status(500).json({ error: 'Internal server error' });
        }
    }
  };
}