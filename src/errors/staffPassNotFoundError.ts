export class StaffPassNotFoundError extends Error {
  constructor(staffPassId: string) {
    super(`Staff pass ID not found: ${staffPassId}`);
    this.name = 'StaffPassNotFoundError';
  }
}