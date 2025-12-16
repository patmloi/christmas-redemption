import { StaffController } from '../../src/controllers/staffController';
import * as StaffValidator from '../../src/validators/staffPassIdValidator';
import { ValidationError, StaffPassNotFoundError } from '../../src/errors/errors';
import { Request, Response, NextFunction } from 'express'; // Import types for mocking
import { errorHandler } from '../../src/middlewares/error-handler.middleware'

// Mocks

// StaffPassIdValidator
jest.mock('../../src/validators/staffPassIdValidator', () => ({
    validateStaffPassId: jest.fn(),
}));

// StaffService
const mockStaffService = {
    lookup: jest.fn(),
};

// Staff
interface MockStaff {
    staff_pass_id: string;
    team_name: string;
    created_at: number,
}

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
    let next: jest.Mock; 

    // Reset mocks
    beforeEach(() => {
        jest.clearAllMocks();
        staffController = new StaffController(mockStaffService as any);
        res = mockResponse();
        next = jest.fn((err) =>  {
            if (err) {
                errorHandler(err, req as Request, res as Response, jest.fn() as NextFunction);
            }
        });
        // (validateStaffPassId as jest.Mock).mockReturnValue(true); 

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
        const staffIdProcessed = 'BOSS_1234567890AB'
        const mockStaff: MockStaff = {
            staff_pass_id: staffIdProcessed,
            team_name: 'DAUNTLESS', 
            created_at: 1620761965347
        }
        
        // Initialise request and response values
        req = mockRequest({ staffPassId: staffIdInput });
        mockStaffService.lookup.mockReturnValue(mockStaff);
        jest.spyOn(StaffValidator, 'validateStaffPassId').mockReturnValue(true);
        // (validateStaffPassId as jest.Mock).mockReturnValue(true);

        // Initialise test
        staffController.lookup(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that the service was called with the correctly processed ID
        expect(mockStaffService.lookup).toHaveBeenCalledWith(staffIdProcessed);
        
        // 2. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockStaff);
    });

    // 1.2. Lowercase Staff Pass ID
    it('hould return 200 by correctly processing a lowercase STAFF Pass ID', () => {
        const staffIdInput = 'boss_1234567890ab';
        const staffIdProcessed = 'BOSS_1234567890AB';
        const mockStaff: MockStaff = {
            staff_pass_id: staffIdProcessed,
            team_name: 'DAUNTLESS', 
            created_at: 1620761965347
        }
        
        // Initialise request and response values
        req = mockRequest({ staffPassId: staffIdInput });
        mockStaffService.lookup.mockReturnValue(mockStaff);
        jest.spyOn(StaffValidator, 'validateStaffPassId').mockReturnValue(true);

        // Initialise test
        staffController.lookup(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that the service was called with the correctly processed ID
        expect(mockStaffService.lookup).toHaveBeenCalledWith(staffIdProcessed);
        
        // 2. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockStaff);
    });

    // 1.3. Staff Pass ID with spaces
    it('should return 200 by correctly processing a Staff Pass ID with extra spaces surrounding it', () => {
        const staffIdInput = '  BOSS_1234567890AB  ';
        const staffIdProcessed = 'BOSS_1234567890AB'; 
        const mockStaff: MockStaff = {
            staff_pass_id: staffIdProcessed,
            team_name: 'DAUNTLESS', 
            created_at: 1620761965347
        }

        // Initialise request and response values
        req = mockRequest({ staffPassId: staffIdInput });
        mockStaffService.lookup.mockReturnValue(mockStaff);
        jest.spyOn(StaffValidator, 'validateStaffPassId').mockReturnValue(true);

        // Initialise test
        staffController.lookup(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that the service was called with the correctly processed ID
        expect(mockStaffService.lookup).toHaveBeenCalledWith(staffIdProcessed);
        
        // 2. Check the response status and body
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockStaff);
    });


    // 2. FAILURE: Invalid Staff Pass IDs

    // 2.1. Empty string
    it('should return 400 when validation fails (ValidationError) due to a string with only spaces', () => {
        const staffIdInput = '     ';
        const errorClass = 'ValidationError';
        const errorMessage = 'Staff Pass ID cannot be an empty value.';

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });
        // Mock the validator to THROW the specific validation error
        jest.spyOn(StaffValidator, 'validateStaffPassId').mockImplementation(() => {
            throw new ValidationError(errorMessage);
        });

        // Act
        staffController.lookup(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that the validator was called with the correctly processed ID
        expect(StaffValidator.validateStaffPassId).toHaveBeenCalledWith('');

        // 2. Check that the service lookup was NOT called
        expect(mockStaffService.lookup).not.toHaveBeenCalled();

        // 3. Check the correct 400 response structure
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });

    // 2.2. String does not contain underscore (Tests that staffController works together with staffPassIdValidator)
    it('should return 400 when validation fails (ValidationError)', () => {
        const staffIdInput = 'BOSS1234567890AB';
        const errorClass = 'ValidationError';
        const errorMessage = 'Staff Pass ID value does not follow expected Staff Pass ID format: Staff Pass ID does not contain an underscore (_). Staff Pass ID value provided: BOSS1234567890AB';

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });
        // Mock the validator to THROW the specific validation error
        jest.spyOn(StaffValidator, 'validateStaffPassId').mockImplementation(() => {
            throw new ValidationError(errorMessage);
        });


        // Act
        staffController.lookup(req as Request, res as Response, next as NextFunction);


        // Assert
        // 1. Check that the validator was called with the correctly processed ID
        expect(StaffValidator.validateStaffPassId).toHaveBeenCalledWith('BOSS1234567890AB');

        // 2. Check that the service lookup was NOT called
        // expect(mockStaffService.lookup).not.toHaveBeenCalled();
        
        // 3. Check the correct 400 response structure
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });

    // 2.3. Staff ID not found by lookup
    it('should return 404 when the staff ID is not found (StaffPassNotFoundError)', () => {
        const staffIdInput = 'BOSS_1234567890CD';
        const errorClass = 'StaffPassNotFoundError';
        const errorMessage = 'Staff pass ID not found: BOSS_1234567890CD';

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });

        // Mock the service to THROW the not found error
        jest.spyOn(StaffValidator, 'validateStaffPassId').mockReturnValue(true);
        // jest.spyOn(mockStaffService, 'lookup').mockImplementation(() => {
        //     throw new StaffPassNotFoundError('BOSS_1234567890CD');
        // });
        mockStaffService.lookup = jest.fn(() => {
            throw new StaffPassNotFoundError('BOSS_1234567890CD');
        });
        
        // Act
        staffController.lookup(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that the validator was called with the correctly processed ID
        expect(StaffValidator.validateStaffPassId).toHaveBeenCalledWith('BOSS_1234567890CD');

        // 2. Check that the service lookup was called
        expect(mockStaffService.lookup).toHaveBeenCalled();

        // 3. Check the correct 404 response structure
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });

    // 2.4. Unexpected error: Database connection error 

    it('should return 500 when an unexpected error occurs during lookup', () => {
        const staffIdInput = 'BOSS_1234567890AB';
        const errorClass = 'Internal Server Error';
        const errorMessage = 'An unexpected error occurred.';
        const serviceError = new Error('Database connection failed.');

        // Arrange
        req = mockRequest({ staffPassId: staffIdInput });
        // Mock the service to THROW an unexpected Error
        mockStaffService.lookup.mockImplementation(() => {
            throw serviceError;
        });

        // Act
        staffController.lookup(req as Request, res as Response, next as NextFunction);

        // Assert
        // 1. Check that the service was called
        expect(mockStaffService.lookup).toHaveBeenCalled();

        // 2. Check console.error was called for debugging
        // expect(console.error).toHaveBeenCalledWith('Lookup error:', serviceError);

        // 3. Check the correct 500 response structure
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: errorClass,
            details: errorMessage,
        });
    });
});