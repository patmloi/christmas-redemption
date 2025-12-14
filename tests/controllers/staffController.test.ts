import { StaffController } from '../../src/controllers/staffController';
import { StaffService, StaffPassNotFoundError } from '../../src/services/staff.service';
import { validateStaffPassId } from '../../src/validators/staffPassIdValidator';
import { ValidationError } from '../../src/errors/validationError';
import { Request, Response } from 'express'; // Import types for mocking

// Mocks

// StaffPassIdValidator
jest.mock('../../src/validators/staffPassIdValidator', () => ({
    validateStaffPassId: jest.fn(),
}));

// StaffService
const mockStaffService = {
    lookup: jest.fn(),
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

describe('StaffController.lookup', () => {
    let staffController: StaffController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    // Reset mocks
    beforeEach(() => {
        jest.clearAllMocks();
        staffController = new StaffController(mockStaffService as any);
        res = mockResponse();
        (validateStaffPassId as jest.Mock).mockReturnValue(true); 

        // Suppress console outputs
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    afterAll(() => {
        // Restore console functions
        (console.error as jest.Mock).mockRestore();
        (console.log as jest.Mock).mockRestore();
    });

        // 1. SUCCESS: Staff Pass ID handling

        // 1.1. Uppercase Staff Pass ID (Expected)
        it('hould return 200 for a valid STAFF Pass ID', () => {
        const staffIdInput = 'BOSS_1234567890AB'; // Input with lowercase
        const staffIdProcessed = 'BOSS_1234567890AB'; // Expected uppercase
        const mockTeamName = 'DAUNTLESS';
        
        // Initialise request and response values
        req = mockRequest({ staffPassId: staffIdInput });
        mockStaffService.lookup.mockReturnValue(mockTeamName);

        // Initialise test
        staffController.lookup(req as Request, res as Response);

        // Assert
        // 1. Check that the service was called with the correctly processed ID
        expect(mockStaffService.lookup).toHaveBeenCalledWith(staffIdProcessed);
        
        // 2. Check the response status and body
        expect(res.status).not.toHaveBeenCalled(); // Default success status is 200
        expect(res.json).toHaveBeenCalledWith({
            staffPassId: staffIdProcessed,
            teamName: mockTeamName,
        });
    });


    // 1.2. Lowercase Staff Pass ID
    it('hould return 200 by correctly processing a lowercase STAFF Pass ID', () => {
        const staffIdInput = 'boss_1234567890ab';
        const staffIdProcessed = 'BOSS_1234567890AB';
        const mockTeamName = 'DAUNTLESS';
        
        // Initialise request and response values
        req = mockRequest({ staffPassId: staffIdInput });
        mockStaffService.lookup.mockReturnValue(mockTeamName);

        // Initialise test
        staffController.lookup(req as Request, res as Response);

        // Assert
        // 1. Check that the service was called with the correctly processed ID
        expect(mockStaffService.lookup).toHaveBeenCalledWith(staffIdProcessed);
        
        // 2. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            staffPassId: staffIdProcessed,
            teamName: mockTeamName,
        });
    });

    // 1.3. Staff Pass ID with spaces
    it('should return 200 by correctly processing a Staff Pass ID with extra spaces surrounding it', () => {
        const staffIdInput = '  BOSS_1234567890AB  ';
        const staffIdProcessed = 'BOSS_1234567890AB'; 
        const mockTeamName = 'DAUNTLESS';

        // Initialise request and response values
        req = mockRequest({ staffPassId: staffIdInput });
        mockStaffService.lookup.mockReturnValue(mockTeamName);

        // Initialise test
        staffController.lookup(req as Request, res as Response);

        // Assert
        // 1. Check that the service was called with the correctly processed ID
        expect(mockStaffService.lookup).toHaveBeenCalledWith(staffIdProcessed);
        
        // 2. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            staffPassId: staffIdProcessed,
            teamName: mockTeamName,
        });
    });


    // 2. FAILURE: Invalid Staff Pass IDs

    // 2.1. Empty string
    it('should return 400 when validation fails (ValidationError) due to a string with only spaces', () => {
        const staffIdInput = '     ';
        const errorMessage = 'Staff Pass ID cannot be an empty value.';

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });
        // Mock the validator to THROW the specific validation error
        (validateStaffPassId as jest.Mock).mockImplementation(() => {
            throw new ValidationError(errorMessage);
        });

        // Act
        staffController.lookup(req as Request, res as Response);

        // Assert
        // 1. Check that the validator was called with the correctly processed ID
        expect(validateStaffPassId).toHaveBeenCalledWith('');

        // 2. Check that the service lookup was NOT called
        expect(mockStaffService.lookup).not.toHaveBeenCalled();

        // 3. Check the correct 400 response structure
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Validation Failed',
            details: errorMessage,
        });
    });

    // 2.2. String does not contain underscore (Tests that staffController works together with staffPassIdValidator)
    it('should return 400 when validation fails (ValidationError)', () => {
        const staffIdInput = 'BOSS1234567890AB';
        const errorMessage = 'Staff Pass ID value does not follow expected Staff Pass ID format: Staff Pass ID does not contain an underscore (_). Staff Pass ID value provided: BOSS1234567890AB';

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });
        // Mock the validator to THROW the specific validation error
        (validateStaffPassId as jest.Mock).mockImplementation(() => {
            throw new ValidationError(errorMessage);
        });

        // Act
        staffController.lookup(req as Request, res as Response);


        // Assert
        // 1. Check that the validator was called with the correctly processed ID
        expect(validateStaffPassId).toHaveBeenCalledWith('BOSS1234567890AB');

        // 2. Check that the service lookup was NOT called
        expect(mockStaffService.lookup).not.toHaveBeenCalled();
        
        // 3. Check the correct 400 response structure
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Validation Failed',
            details: errorMessage,
        });
    });

    // 2.3. Staff ID not found by lookup
    it('should return 404 when the staff ID is not found (StaffPassNotFoundError)', () => {
        const staffIdInput = 'BOSS_1234567890CD';
        const errorMessage = 'Staff pass ID not found: BOSS_1234567890CD';

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });
        // Mock the service to THROW the not found error
        mockStaffService.lookup.mockImplementation(() => {
            throw new StaffPassNotFoundError('BOSS_1234567890CD');
        });

        // Act
        staffController.lookup(req as Request, res as Response);

        // Assert
        // 1. Check that the validator was called with the correctly processed ID
        expect(validateStaffPassId).toHaveBeenCalledWith('BOSS_1234567890CD');

        // 2. Check that the service lookup was called
        expect(mockStaffService.lookup).toHaveBeenCalled();

        // 3. Check the correct 404 response structure
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: errorMessage,
        });
    });

    // 2.4. Unexpected error: Database connection error 

    it('should return 500 when an unexpected error occurs during lookup', () => {
        const staffIdInput = 'BOSS_1234567890AB';
        const serviceError = new Error('Database connection failed.');

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });
        // Mock the service to THROW an unexpected Error
        mockStaffService.lookup.mockImplementation(() => {
            throw serviceError;
        });

        // Act
        staffController.lookup(req as Request, res as Response);

        // Assert
        // 1. Check that the service was called
        expect(mockStaffService.lookup).toHaveBeenCalled();

        // 2. Check console.error was called for debugging
        expect(console.error).toHaveBeenCalledWith('Lookup error:', serviceError);

        // 3. Check the correct 500 response structure
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error',
        });
    });
});