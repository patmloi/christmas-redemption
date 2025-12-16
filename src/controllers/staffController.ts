import { Request, Response, NextFunction } from 'express';
import { StaffService } from '../services/staff.service';
import { validateStaffPassId } from '../validators/staffPassIdValidator';

export class StaffController {
  constructor(private staffService: StaffService) {}

  lookup = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // Staff Pass ID
        let { staffPassId } = req.params;
        staffPassId = String(staffPassId).toUpperCase().trim();

        // Validate Staff Pass ID before retrieval
        if (validateStaffPassId(staffPassId)){
            const staff = this.staffService.lookup(staffPassId);
            res.json(staff);
        }

    } catch (error) {
      next(error);
    }
  };
}