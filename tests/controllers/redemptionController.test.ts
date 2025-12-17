import { RedemptionController } from '../../src/controllers/redemptionController';
import { ValidationError, TeamNameNotFoundError, AlreadyRedeemedError } from '../../src/errors/errors';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middlewares/error-handler.middleware'


// Mocks

// StaffService
const mockStaffService = {
    checkTeamNameExists: jest.fn(),
};

// RedemptionService
const mockRedemptionService = {
    checkEligibility: jest.fn(),
};

// Request
const mockRequest = (params = {}, body = {}, query = {}): Partial<Request> => ({
    params: params as any,
    body: body as any,
    query: query as any,
});

// Response
const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis() as any;
    res.json = jest.fn().mockReturnThis() as any;
    res.send = jest.fn().mockReturnThis() as any;
    return res;
};

describe('RedemptionController.checkEligibility', () => {
    let redemptionController: RedemptionController;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock; 
    next = jest.fn((err) =>  {
        if (err) {
            errorHandler(err, req as Request, res as Response, jest.fn() as NextFunction);
        }
    });

    // Reset mocks
    beforeEach(() => {
        jest.clearAllMocks();
        redemptionController = new RedemptionController(
            mockStaffService as any,
            mockRedemptionService as any
        );
        res = mockResponse();

        // Suppress console outputs
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterAll(() => {
        // Restore console functions
        (console.error as jest.Mock).mockRestore();
        (console.log as jest.Mock).mockRestore();
    });

    // 1. SUCCESS: Valid team name that is eligible

    // 1.1. Uppercase team name (Expected)
    it('should return 200 with eligible: true for a valid team name that has not redeemed', () => {
        const teamNameInput = 'DAUNTLESS';
        const teamNameProcessed = 'DAUNTLESS';
        const expectedResponse = {
            eligible: true,
            message: `Team ${teamNameProcessed} has not yet redeemed their Christmas gift.`
        };

        // Arrange
        req = mockRequest({ teamName: teamNameInput });
        mockStaffService.checkTeamNameExists.mockReturnValue(true);
        mockRedemptionService.checkEligibility.mockReturnValue(expectedResponse);

        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that checkTeamNameExists was called with the correctly processed name
        expect(mockStaffService.checkTeamNameExists).toHaveBeenCalledWith(teamNameProcessed);

        // 2. Check that checkEligibility was called with the correctly processed name
        expect(mockRedemptionService.checkEligibility).toHaveBeenCalledWith(teamNameProcessed);

        // 3. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    // 1.2. Lowercase team name
    it('should return 200 by correctly processing a lowercase team name', () => {
        const teamNameInput = 'amity';
        const teamNameProcessed = 'AMITY';
        const expectedResponse = {
            eligible: true,
            message: `Team ${teamNameProcessed} has not yet redeemed their Christmas gift.`
        };

        // Arrange
        req = mockRequest({ teamName: teamNameInput });
        mockStaffService.checkTeamNameExists.mockReturnValue(true);
        mockRedemptionService.checkEligibility.mockReturnValue(expectedResponse);

        
        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that checkTeamNameExists was called with the correctly processed name
        expect(mockStaffService.checkTeamNameExists).toHaveBeenCalledWith(teamNameProcessed);

        // 2. Check that checkEligibility was called
        expect(mockRedemptionService.checkEligibility).toHaveBeenCalledWith(teamNameProcessed);

        // 3. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    // 1.3. Team name with spaces
    it('should return 200 by correctly processing a team name with extra spaces surrounding it', () => {
        const teamNameInput = '  ERUDITE  ';
        const teamNameProcessed = 'ERUDITE';
        const expectedResponse = {
            eligible: true,
            message: `Team ${teamNameProcessed} has not yet redeemed their Christmas gift.`
        };

        // Arrange
        req = mockRequest({ teamName: teamNameInput });
        mockStaffService.checkTeamNameExists.mockReturnValue(true);
        mockRedemptionService.checkEligibility.mockReturnValue(expectedResponse);

        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that checkTeamNameExists was called with the correctly processed name
        expect(mockStaffService.checkTeamNameExists).toHaveBeenCalledWith(teamNameProcessed);

        // 2. Check that checkEligibility was called
        expect(mockRedemptionService.checkEligibility).toHaveBeenCalledWith(teamNameProcessed);

        // 3. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });

    // 2. FAILURE: Invalid team names

    // 2.1. Empty string
    it('should return 400 when team name is empty (ValidationError)', () => {
        const teamNameInput = '     ';
        const errorClass = 'ValidationError';
        const errorMessage = 'Team name cannot be an empty value.';

        // Arrange
        req = mockRequest({ teamName: teamNameInput });

        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that checkTeamNameExists was NOT called
        expect(mockStaffService.checkTeamNameExists).not.toHaveBeenCalled();

        // 2. Check that checkEligibility was NOT called
        expect(mockRedemptionService.checkEligibility).not.toHaveBeenCalled();

        // 3. Check the correct 400 response structure
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });

    // 2.2. Team name not found
    it('should return 404 when team name does not exist (TeamNameNotFoundError)', () => {
        const teamNameInput = 'DIVERGENT';
        const errorClass = 'TeamNameNotFoundError';
        const errorMessage = 'Team name not found: DIVERGENT';

        // Arrange
        req = mockRequest({ teamName: teamNameInput });
        mockStaffService.checkTeamNameExists.mockReturnValue(false);

        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that checkTeamNameExists was called
        expect(mockStaffService.checkTeamNameExists).toHaveBeenCalledWith('DIVERGENT');

        // 2. Check that checkEligibility was NOT called
        expect(mockRedemptionService.checkEligibility).not.toHaveBeenCalled();

        // 3. Check the correct 404 response structure
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });

    // 2.3. Team already redeemed
    it('should return 403 when team has already redeemed (AlreadyRedeemedError)', () => {
        const teamNameInput = 'DAUNTLESS';
        const redeemedByStaffPassId = 'BOSS_1234567890AB';
        const errorClass = 'AlreadyRedeemedError';
        const errorMessage = `Team has already redeemed: ${redeemedByStaffPassId} has redeemed on behalf of ${teamNameInput}.`;

        // Arrange
        req = mockRequest({ teamName: teamNameInput });
        mockStaffService.checkTeamNameExists.mockReturnValue(true);
        mockRedemptionService.checkEligibility.mockImplementation(() => {
            throw new AlreadyRedeemedError(teamNameInput, redeemedByStaffPassId);
        });

        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that checkTeamNameExists was called
        expect(mockStaffService.checkTeamNameExists).toHaveBeenCalledWith('DAUNTLESS');

        // 2. Check that checkEligibility was called
        expect(mockRedemptionService.checkEligibility).toHaveBeenCalledWith('DAUNTLESS');

        // 3. Check the correct 403 response structure
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });

    // 2.4. Unexpected error
    it('should return 500 when an unexpected error occurs', () => {
        const teamNameInput = 'DAUNTLESS';
        const errorClass = 'Internal Server Error';
        const errorMessage = 'An unexpected error occurred.';
        const serviceError = new Error('Database connection failed.');

        // Arrange
        req = mockRequest({ teamName: teamNameInput });
        mockStaffService.checkTeamNameExists.mockImplementation(() => {
            throw serviceError;
        });

        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that checkTeamNameExists was called
        expect(mockStaffService.checkTeamNameExists).toHaveBeenCalled();

        // 2. Check the correct 500 response structure
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });

    // 2.5. Undefined team name parameter
    it('should return 400 when team name parameter is undefined (ValidationError)', () => {
        const errorClass = 'ValidationError';
        const errorMessage = 'Team name cannot be an empty value.';

        // Arrange
        req = mockRequest({}); // No teamName parameter

        // Act
        redemptionController.checkEligibility(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that services were NOT called
        expect(mockStaffService.checkTeamNameExists).not.toHaveBeenCalled();
        expect(mockRedemptionService.checkEligibility).not.toHaveBeenCalled();

        // 2. Check the correct 400 response structure
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });
});