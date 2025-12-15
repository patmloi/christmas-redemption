import { Request, Response } from 'express';
import { RedemptionService} from '../services/redemption.service';

export class RedemptionController {
  constructor(private redemptionService: RedemptionService) {}

  checkEligibility = (req: Request, res: Response): void => {
    try {
      const { teamName } = req.params;
      const eligible = this.redemptionService.checkEligibility(teamName);
      res.json({ teamName, eligible });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}