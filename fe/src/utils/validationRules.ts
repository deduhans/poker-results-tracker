/**
 * Shared validation rules for forms throughout the application
 */

/**
 * Username validation rules
 * - Required
 * - 3-20 characters
 * - Only letters, numbers, underscores, and dashes
 */
export const usernameRules = [
  (v: string) => !!v || 'Username is required',
  (v: string) => (v && v.length >= 3) || 'Username must be at least 3 characters',
  (v: string) => (v && v.length <= 20) || 'Username must be less than 20 characters',
  (v: string) => /^[a-zA-Z0-9_-]+$/.test(v) || 'Username can only contain letters, numbers, underscores and dashes',
];

/**
 * Password validation rules
 * - Required
 * - At least 8 characters
 * - Contains at least one number
 * - Contains at least one letter
 */
export const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
  (v: string) => /\d/.test(v) || 'Password must contain at least one number',
  (v: string) => /[a-zA-Z]/.test(v) || 'Password must contain at least one letter',
];

/**
 * Creates a password confirmation rule that validates against the provided password
 * @param password The password to validate against
 * @returns A validation rule function
 */
export const createPasswordConfirmationRule = (password: string) => {
  return (v: string) => v === password || 'Passwords must match';
};

/**
 * Email validation rules
 * - Required
 * - Valid email format
 */
export const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
];

/**
 * Required field validation rule
 * @param fieldName Name of the field for the error message
 * @returns A validation rule function
 */
export const requiredRule = (fieldName: string = 'Field') => {
  return (v: any) => !!v || `${fieldName} is required`;
};

/**
 * Minimum length validation rule
 * @param length Minimum required length
 * @param fieldName Name of the field for the error message
 * @returns A validation rule function
 */
export const minLengthRule = (length: number, fieldName: string = 'Field') => {
  return (v: string) => !v || v.length >= length || `${fieldName} must be at least ${length} characters`;
};

/**
 * Maximum length validation rule
 * @param length Maximum allowed length
 * @param fieldName Name of the field for the error message
 * @returns A validation rule function
 */
export const maxLengthRule = (length: number, fieldName: string = 'Field') => {
  return (v: string) => !v || v.length <= length || `${fieldName} must be less than ${length} characters`;
};

/**
 * Pattern validation rule
 * @param pattern RegExp pattern to test
 * @param errorMessage Error message to display
 * @returns A validation rule function
 */
export const patternRule = (pattern: RegExp, errorMessage: string) => {
  return (v: string) => !v || pattern.test(v) || errorMessage;
};
