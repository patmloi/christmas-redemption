export interface AppErrorInterface extends Error {
  statusCode: number;
}

export class AppError extends Error implements AppErrorInterface {
  public statusCode: number; 
  public name: string; 
  public message: string;

  constructor(statusCode: number, name: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name= name;
    this.message = message; 
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, 'ValidationError', message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class AlreadyRedeemedError extends AppError {
    constructor(teamName: string, staffPassId: string) {
        super(403, 'AlreadyRedeemedError', `Team has already redeemed: ${staffPassId} has redeemed on behalf of ${teamName}.`);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class StaffPassNotFoundError extends AppError {
    constructor(staffPassId: string) {
        super(404, 'StaffPassNotFoundError', `Staff pass ID not found: ${staffPassId}`);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export class TeamNameNotFoundError extends AppError {
    constructor(teamName: string) {
        super(404, 'TeamNameNotFoundError', `Team name not found: ${teamName}`);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}