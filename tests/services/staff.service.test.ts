import { StaffService } from '../../src/services/staff.service';
import { StorageService } from '../../src/services/storage.service';
import { StaffPassNotFoundError } from '../../src/errors/errors';

// Mocks
interface MockStaffRecord {
    staff_pass_id: string;
    team_name: string;
}

const mockStorageService = {
    findStaffByPassId: jest.fn(),
};

describe('StaffService.lookup', () => {
    let staffService: StaffService;
    
    // Suppress console output during tests
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {

        jest.clearAllMocks();
        
        // Initialise service with dependencies
        staffService = new StaffService(mockStorageService as unknown as StorageService);
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
       (console.log as jest.Mock).mockRestore();
    });

    // 1. SUCCESS: Staff Pass ID found

    it('should return the team name when a staff pass ID is found', () => {
        const staffId = 'BOSS_1234567890AB';
        const expectedTeamName = 'Alpha Team';
        
        const mockStaff: MockStaffRecord = {
            staff_pass_id: staffId,
            team_name: expectedTeamName,
        };

        // Initialise mock return value
        mockStorageService.findStaffByPassId.mockReturnValue(mockStaff);

        // Initialise test
        const result = staffService.lookup(staffId);

        // Assert
        // 1. Check if the storage method was called correctly
        expect(mockStorageService.findStaffByPassId).toHaveBeenCalledWith(staffId);
        
        // 2. Check the returned value
        expect(result).toBe(expectedTeamName);
    });

    // 2. FAILURE: Staff Pass ID not found

    it('should throw StaffPassNotFoundError when the staff pass ID is NOT found', () => {
        const staffId = 'BOSS_123456789CD';

        // Initialise mock return value
        mockStorageService.findStaffByPassId.mockReturnValue(null);

        // Assert
        // 1. Check the returned error
         expect(() => staffService.lookup(staffId)).toThrow(StaffPassNotFoundError);
        
        // 2. Check that the correct error message is thrown
        const expectedErrorMessage = `Staff pass ID not found: ${staffId}`;
        expect(() => staffService.lookup(staffId)).toThrow(expectedErrorMessage);

        // 3. Check if the storage method was called correctly: Check error message before checking whether it was called
        expect(mockStorageService.findStaffByPassId).toHaveBeenCalledWith(staffId);
    });
});