import { StorageService } from './storage.service';

export class StaffPassNotFoundError extends Error {
  constructor(staffPassId: string) {
    super(`Staff pass ID not found: ${staffPassId}`);
    this.name = 'StaffPassNotFoundError';
  }
}

export class StaffService {
    constructor(private storage: StorageService) {}
    lookup(staffPassId: string): string {
        const staff = this.storage.findStaffByPassId(staffPassId);
        if (!staff) {
            throw new StaffPassNotFoundError(staffPassId);
        }
        return staff.team_name;
    }
}
