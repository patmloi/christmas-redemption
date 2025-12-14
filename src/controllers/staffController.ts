import { Request, Response } from 'express';
import { StaffService } from '../services/staff.service';
import { StaffPassNotFoundError } from '../services/staff.service';
import { validateStaffPassId } from '../validators/staffPassIdValidator';
import { ValidationError } from '../errors/validationError';

export class StaffController {
  constructor(private staffService: StaffService) {}

  lookup = (req: Request, res: Response): void => {
    try {
        // Staff Pass ID
        let { staffPassId } = req.params;
        staffPassId = String(staffPassId).toUpperCase().trim();

        // Validate Staff Pass ID before retrieval
        if (validateStaffPassId(staffPassId)){
            const teamName = this.staffService.lookup(staffPassId);
            res.json({ 
                staffPassId, 
                teamName 
            });
        }

    } catch (error) {
    
    // Validation error
    if (error instanceof ValidationError) {
        res.status(400).json({ 
            error: 'Validation Failed', 
            details: error.message 
        });  
    }

    // Staff pass not found
    else if (error instanceof StaffPassNotFoundError) {
        res.status(404).json({ 
            error: error.message 
        });
      } 
    
    // Lookup error
    else {
        console.error('Lookup error:', error);
        res.status(500).json({ 
          error: 'Internal server error' 
        });
      }
    }
  };
}