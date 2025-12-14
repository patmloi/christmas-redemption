import { ValidationError } from '../errors/validationError'

export const validateStaffPassId = (staffPassId: string): boolean => {

    const idUnexpectedMsg = 'Staff Pass ID value does not follow expected Staff Pass ID format:'
    const idProvidedMsg = `Staff Pass ID value provided: ${staffPassId}`
    const idSuffixMsg = 'Staff Pass ID does not end with a 12-character alphanumeric string'
    const idParts = staffPassId.split('_')

    // Check whether Staff Pass ID is empty.
    if (staffPassId == '') {
        throw new ValidationError('Staff Pass ID cannot be an empty value.');
    }

    // Check whether Staff Pass ID contains exactly one underscore.
    else if (idParts.length !== 2) {
        // Check whether Staff Pass ID contains underscore.
        if (idParts.length === 1) {
            throw new ValidationError(`${idUnexpectedMsg} Staff Pass ID does not contain an underscore (_). ${idProvidedMsg}`);
        }

        // Check whether Staff Pass ID contains exactly one underscore.
        else {
            throw new ValidationError(`${idUnexpectedMsg} Staff Pass ID contains ${idParts.length - 1} underscores, expected exactly 1. ${idProvidedMsg}`);
        }
    }

    // Check whether Staff Pass ID components are valid.
    else if (idParts.length == 2) {
        const allowedPrefixes = ['BOSS', 'MANAGER', 'STAFF'];
        const allowedSuffixRegex = /^[a-zA-Z0-9]{12}$/;
        const allNumericSuffixRegex = /^\d{12}$/;
        const specialCharRegex = /[^a-zA-Z0-9]+/
        const staffPassIdPrefix = idParts[0].toUpperCase();
        const staffPassIdSuffix = idParts[1].toUpperCase();

        // Check whether Staff Pass ID prefix is valid.
        if (!allowedPrefixes.includes(staffPassIdPrefix)) {
            throw new ValidationError(`${idUnexpectedMsg} Staff Pass ID does not start with any of the following accepted values (BOSS, MANAGER, STAFF). ${idProvidedMsg}`)
        }

        // Check whether Staff Pass ID suffix is valid.
        else if (!allowedSuffixRegex.test(staffPassIdSuffix)) {

            // Check if suffix contains non-alphanumeric characters.
            if (specialCharRegex.test(staffPassIdSuffix)) {
                throw new ValidationError(`${idUnexpectedMsg} ${idSuffixMsg}, contains special characters. ${idProvidedMsg}`)
            }

            // Check whether Staff Pass ID is invalid because length is != 12.
            else if (staffPassIdSuffix.length != 12) {
                throw new ValidationError(`${idUnexpectedMsg} ${idSuffixMsg}, length is not 12 characters. ${idProvidedMsg}`)
            }

            else {
                throw new ValidationError(`${idUnexpectedMsg}. ${idSuffixMsg}. ${idProvidedMsg}`)
            }
        }

        // Check if Staff Pass ID is all numeric characters. 
        else if (allNumericSuffixRegex.test(staffPassIdSuffix)) {
            throw new ValidationError(`${idUnexpectedMsg} ${idSuffixMsg}, suffix only contains numeric characters. ${idProvidedMsg}`)
        }
    }

    // All Staff Pass ID tests passed
    return true;

};