/**
 * Utility functions for handling errors in the application
 */

import { AxiosError } from 'axios';

/**
 * Extracts a user-friendly error message from various error types
 * @param error The error object (typically from a catch block)
 * @param defaultMessage Default message to show if no specific message can be extracted
 * @returns A user-friendly error message string
 */
export const extractErrorMessage = (error: unknown, defaultMessage: string = 'An unexpected error occurred'): string => {
  // Handle Axios errors
  if (isAxiosError(error)) {
    // Try to get the error message from the response
    const responseData = error.response?.data as { message?: string | string[] };
    const responseMessage = responseData?.message;
    
    // If we have a specific message from the server, use it
    if (responseMessage) {
      return Array.isArray(responseMessage) ? responseMessage[0] : responseMessage;
    }
    
    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This operation could not be completed due to a conflict.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${error.message || defaultMessage}`;
    }
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Default fallback
  return defaultMessage;
};

/**
 * Type guard to check if an error is an AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError === true;
}

/**
 * Formats validation errors from the backend into a user-friendly format
 * @param errors Validation errors object from the backend
 * @returns Formatted error message
 */
export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  if (!errors) return 'Validation failed';
  
  return Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
      return `${fieldName}: ${messages.join(', ')}`;
    })
    .join('\n');
};

/**
 * Handles authentication errors specifically
 * @param error The error object
 * @returns A user-friendly error message for auth errors
 */
export const handleAuthError = (error: unknown): string => {
  if (isAxiosError(error) && error.response?.status === 401) {
    return 'Invalid username or password. Please try again.';
  }
  
  return extractErrorMessage(error, 'Authentication failed. Please try again.');
};
