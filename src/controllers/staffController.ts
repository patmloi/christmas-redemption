import { Request, Response } from 'express';
import { StaffService } from '../services/staff.service';
import { StaffPassNotFoundError } from '../services/staff.service';

export class StaffController {
  constructor(private staffService: StaffService) {}

  lookup = (req: Request, res: Response): void => {
    try {
        const { staffPassId } = req.params;
        console.log('Extracted staffPassId:', staffPassId);

        /** Retrieve team name **/
        const teamName = this.staffService.lookup(staffPassId);
        res.json({ 
            staffPassId, 
            teamName 
        });

    } catch (error) {
      if (error instanceof StaffPassNotFoundError) {
        res.status(404).json({ 
          error: error.message 
        });
      } else {
        console.error('Lookup error:', error);
        res.status(500).json({ 
          error: 'Internal server error' 
        });
      }
    }
  };
}