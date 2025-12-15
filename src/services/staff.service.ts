import { StorageService } from './storage.service';
import { StaffPassNotFoundError } from '../errors/errors'; 

export class StaffService {
    constructor(private storage: StorageService) {}
    
    lookup(staffPassId: string): string {
        const staff = this.storage.findStaffByPassId(staffPassId);
        if (!staff) {
            throw new StaffPassNotFoundError(staffPassId);
        }
        return staff.team_name;
    }

    checkTeamNameExists(teamName: string): boolean {
      let teamNameInstances = this.storage.findTeamNameInstances(teamName)
      return teamNameInstances > 0;
    }
}
