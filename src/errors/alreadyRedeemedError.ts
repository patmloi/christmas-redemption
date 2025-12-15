export class AlreadyRedeemedError extends Error {
  constructor(teamName: string) {
    super(`Team has already redeemed: ${teamName}`);
    this.name = 'AlreadyRedeemedError';
  }
}