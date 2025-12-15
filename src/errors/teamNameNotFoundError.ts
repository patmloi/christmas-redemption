export class TeamNameNotFoundError extends Error {
  constructor(teamName: string) {
    super(`Team name not found: ${teamName}`);
    this.name = 'TeamNameNotFoundError';
  }
}