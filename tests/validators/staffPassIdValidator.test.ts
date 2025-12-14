import { validateStaffPassId } from '../../src/validators/staffPassIdValidator';
import { ValidationError } from '../../src/errors/validationError'; // Import the custom error class

// Helper variables for common parts of error messages
    const idUnexpectedMsg = 'Staff Pass ID value does not follow expected Staff Pass ID format:';
    const idUnexpectedSuffixMsg = 'Staff Pass ID does not end with a 12-character alphanumeric string,';

    const idProvidedMsg = 'Staff Pass ID value provided:';
    const idNotEmptyMsg = 'Staff Pass ID cannot be an empty value.'
    const idNoUnderscoreMsg = 'Staff Pass ID does not contain an underscore (_).';
    const idTwoUnderscoresMsg = 'Staff Pass ID contains 2 underscores, expected exactly 1.';
    const idPrefixMsg = 'Staff Pass ID does not start with any of the following accepted values (BOSS, MANAGER, STAFF).';
    const idSuffixSpecialCharMsg = 'contains special characters.';
    const idSuffixLengthMsg = 'length is not 12 characters.';
    const idSuffixAllNumericMsg = 'suffix only contains numeric characters.';

    let fullMsg = (staffPassId: any, errorDetails: string) => { 
        return `${idUnexpectedMsg} ${errorDetails} ${idProvidedMsg} ${staffPassId}`
    }

    let fullSuffixMsg = (staffPassId: any, errorDetails: string) => { 
        return `${idUnexpectedMsg} ${idUnexpectedSuffixMsg} ${errorDetails} ${idProvidedMsg} ${staffPassId}`
    }

// 1. SUCCESS: Valid Staff Pass IDs
describe('validateStaffPassId - Success Cases (Valid IDs)', () => {
    
    // 1.1. BOSS ID with mixed alphanumeric suffix
    it('should return true for a valid BOSS ID with mixed suffix', () => {
        const validId = 'BOSS_1234567890AB';
        expect(validateStaffPassId(validId)).toBe(true);
    });

    // 1.2. MANAGER ID with mixed alphanumeric suffix
    it('should return true for a valid MANAGER ID with mixed suffix', () => {
        const validId = 'MANAGER_1234567890AB';
        expect(validateStaffPassId(validId)).toBe(true);
    });

    // 1.3. Valid: STAFF ID with mixed alphanumeric suffix
    it('should return true for a valid STAFF ID with mixed suffix', () => {
        const validId = 'STAFF_1234567890AB';
        expect(validateStaffPassId(validId)).toBe(true);
    });
    
    // 1.4. Valid: BOSS ID with alphabetical only suffix
    it('should return true for a valid BOSS ID with all-alphabetical suffix', () => {
        const validId = 'BOSS_ABCDEFGHIJKL';
        expect(validateStaffPassId(validId)).toBe(true);
    });

});

// 2. FAILURE: Invalid Staff Pass IDs
describe('validateStaffPassId - Failure Cases (Invalid IDs)', () => {

    // 2.1. Empty value checks

    it('should throw ValidationError for an empty string', () => {
        const emptyId = '';
        expect(() => validateStaffPassId(emptyId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(emptyId)).toThrow(`${idNotEmptyMsg}`);
    });
    
    // 2.2. Underscore checks

    it('should throw ValidationError when underscore is missing', () => {
        const noUnderscoreId = 'BOSS1234567890AB';
        expect(() => validateStaffPassId(noUnderscoreId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(noUnderscoreId)).toThrow(`${fullMsg(noUnderscoreId, idNoUnderscoreMsg)}`);
    });

    it('should throw ValidationError when multiple underscores are present', () => {
        const multiUnderscoreId = 'BOSS_1234567890AB_';
        expect(() => validateStaffPassId(multiUnderscoreId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(multiUnderscoreId)).toThrow(`${fullMsg(multiUnderscoreId, idTwoUnderscoresMsg)}`);
    });

    it('should throw ValidationError when multiple consecutive underscores are present', () => {
        const multiConsecutiveUnderscoreId = 'BOSS__1234567890AB';
        expect(() => validateStaffPassId(multiConsecutiveUnderscoreId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(multiConsecutiveUnderscoreId)).toThrow(`${fullMsg(multiConsecutiveUnderscoreId, idTwoUnderscoresMsg)}`);
    });

    // 2.3. Prefix checks

    it('should throw ValidationError for an invalid prefix (e.g., INTERN)', () => {
        const invalidPrefixId = 'INTERN_1234567890AB';
        expect(() => validateStaffPassId(invalidPrefixId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(invalidPrefixId)).toThrow(fullMsg(invalidPrefixId, idPrefixMsg));
    });

    it('should throw ValidationError for an empty prefix (e.g., _SUFFIX)', () => {
        const emptyPrefixId = '_1234567890AB';
        expect(() => validateStaffPassId(emptyPrefixId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(emptyPrefixId)).toThrow(fullMsg(emptyPrefixId, idPrefixMsg));
    });


    // 2.4. Suffix checks

    // 2.4.1. Suffix length checks 

    it('should throw ValidationError when suffix is too short (11 chars)', () => {
        const shortSuffixId = 'BOSS_1234567890A';
        expect(() => validateStaffPassId(shortSuffixId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(shortSuffixId)).toThrow(fullSuffixMsg(shortSuffixId, idSuffixLengthMsg));
    });

    it('should throw ValidationError when suffix is too long (13 chars)', () => {
        const longSuffixId = 'BOSS_1234567890ABC';
        expect(() => validateStaffPassId(longSuffixId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(longSuffixId)).toThrow(fullSuffixMsg(longSuffixId, idSuffixLengthMsg));
    });

    // 2.4.2. Suffix special character checks 
    it('should throw ValidationError when suffix contains a special character (hyphen)', () => {
        const specialCharId = 'STAFF_12345678901-';
        expect(() => validateStaffPassId(specialCharId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(specialCharId)).toThrow(fullSuffixMsg(specialCharId, idSuffixSpecialCharMsg));
    });

    it('should throw ValidationError when suffix contains a special character (space)', () => {
        const specialCharId = 'BOSS_1234567890 A';
        expect(() => validateStaffPassId(specialCharId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(specialCharId)).toThrow(fullSuffixMsg(specialCharId, idSuffixSpecialCharMsg));
    });

    // 2.4.3. All numeric suffix check
    
    it('should throw ValidationError when suffix is all numeric (12 digits)', () => {
        const allNumericId = 'MANAGER_123456789012';
        expect(() => validateStaffPassId(allNumericId)).toThrow(ValidationError);
        expect(() => validateStaffPassId(allNumericId)).toThrow(fullSuffixMsg(allNumericId, idSuffixAllNumericMsg));
    });
    
    it('should fail the length check first if all numeric and short', () => {
        const allNumericShort = 'MANAGER_12345';
        expect(() => validateStaffPassId(allNumericShort)).toThrow(ValidationError);
        expect(() => validateStaffPassId(allNumericShort)).toThrow(fullSuffixMsg(allNumericShort, idSuffixLengthMsg)); 
    });
});