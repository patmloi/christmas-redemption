export class AlreadyRedeemedError extends Error {
  constructor(teamName: string, staffPassId: string) {
    super(`Team has already redeemed: ${staffPassId} has redeemed on behalf of ${teamName}.`);
    this.name = 'AlreadyRedeemedError';
  }
}