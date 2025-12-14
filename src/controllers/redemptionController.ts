import { Request, Response } from 'express';
import { RedemptionService, StaffPassNotFoundError, AlreadyRedeemedError } from '../services/redemption.service';

export class RedemptionController {
  constructor(private redemptionService: RedemptionService) {}

  lookup = (req: Request, res: Response): void => {
    try {
      const { staffPassId } = req.params;
      const teamName = this.redemptionService.lookup(staffPassId);
      res.json({ staffPassId, teamName });
    } catch (error) {
      if (error instanceof StaffPassNotFoundError) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  checkEligibility = (req: Request, res: Response): void => {
    try {
      const { teamName } = req.params;
      const eligible = this.redemptionService.checkEligibility(teamName);
      res.json({ teamName, eligible });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  redeem = (req: Request, res: Response): void => {
    try {
      const { staffPassId } = req.body;
      
      if (!staffPassId) {
        res.status(400).json({ error: 'staffPassId is required' });
        return;
      }

      const redemption = this.redemptionService.redeem(staffPassId);
      res.status(201).json({
        success: true,
        data: redemption
      });
    } catch (error) {
      if (error instanceof StaffPassNotFoundError) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof AlreadyRedeemedError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}