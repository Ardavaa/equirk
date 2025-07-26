// Utility functions for authentication
export class AuthUtils {
  /**
   * Format principal ID for display
   * @param {string} principal - The principal ID
   * @param {number} startChars - Number of characters to show at start
   * @param {number} endChars - Number of characters to show at end
   * @returns {string} Formatted principal
   */
  static formatPrincipal(principal, startChars = 8, endChars = 4) {
    if (!principal || typeof principal !== 'string') return '';

    if (principal.length <= startChars + endChars + 3) {
      return principal;
    }

    return `${principal.slice(0, startChars)}...${principal.slice(-endChars)}`;
  }

  /**
   * Validate principal ID format
   * @param {string} principal - The principal ID to validate
   * @returns {boolean} Whether the principal is valid
   */
  static isValidPrincipal(principal) {
    if (!principal || typeof principal !== 'string') return false;

    // Basic validation for IC principal format
    // Principals are base32-encoded with specific patterns
    const principalRegex = /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/;
    return principalRegex.test(principal) || principal.length > 20;
  }

  /**
   * Get authentication status message
   * @param {boolean} isAuthenticated - Authentication status
   * @param {boolean} isLoading - Loading status
   * @param {string} error - Error message if any
   * @returns {Object} Status object with message and type
   */
  static getAuthStatusMessage(isAuthenticated, isLoading, error) {
    if (error) {
      return {
        type: 'error',
        message: 'Authentication failed',
        details: error
      };
    }

    if (isLoading) {
      return {
        type: 'loading',
        message: 'Connecting to Internet Identity',
        details: 'Please wait while we authenticate you...'
      };
    }

    if (isAuthenticated) {
      return {
        type: 'success',
        message: 'Successfully authenticated',
        details: 'You are now logged in with Internet Identity'
      };
    }

    return {
      type: 'info',
      message: 'Not authenticated',
      details: 'Please log in to access protected features'
    };
  }

  /**
   * Check if session is about to expire
   * @param {number} maxTimeToLive - Maximum session time in nanoseconds
   * @param {number} warningThreshold - Warning threshold in milliseconds (default: 5 minutes)
   * @returns {boolean} Whether session is about to expire
   */
  static isSessionExpiring(maxTimeToLive, warningThreshold = 5 * 60 * 1000) {
    if (!maxTimeToLive) return false;

    // Convert nanoseconds to milliseconds
    const sessionTimeMs = Number(maxTimeToLive) / 1000000;
    const currentTime = Date.now();

    // Check if session will expire within warning threshold
    return (sessionTimeMs - currentTime) < warningThreshold;
  }

  /**
   * Get remaining session time in human readable format
   * @param {number} maxTimeToLive - Maximum session time in nanoseconds
   * @returns {string} Human readable time remaining
   */
  static getSessionTimeRemaining(maxTimeToLive) {
    if (!maxTimeToLive) return 'Unknown';

    const sessionTimeMs = Number(maxTimeToLive) / 1000000;
    const currentTime = Date.now();
    const remainingMs = sessionTimeMs - currentTime;

    if (remainingMs <= 0) return 'Expired';

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Less than 1m';
    }
  }

  /**
   * Generate a user-friendly error message for authentication errors
   * @param {Error} error - The error object
   * @returns {string} User-friendly error message
   */
  static getAuthErrorMessage(error) {
    if (!error) return 'Unknown authentication error';

    const errorMessage = error.message || error.toString();

    // Common error patterns and their user-friendly messages
    const errorMappings = {
      'UserInterrupt': 'Login was cancelled by user',
      'popup_closed_by_user': 'Login popup was closed',
      'network': 'Network connection error. Please check your internet connection.',
      'timeout': 'Login request timed out. Please try again.',
      'identity_provider': 'Unable to connect to Internet Identity service',
      'invalid_delegation': 'Authentication session is invalid or expired',
      'unauthorized': 'Authentication failed. Please try logging in again.'
    };

    // Check for known error patterns
    for (const [pattern, message] of Object.entries(errorMappings)) {
      if (errorMessage.toLowerCase().includes(pattern.toLowerCase())) {
        return message;
      }
    }

    // Return original error message if no pattern matches
    return errorMessage;
  }

  /**
   * Store authentication state in localStorage for persistence
   * @param {Object} authState - Authentication state to store
   */
  static storeAuthState(authState) {
    try {
      const stateToStore = {
        isAuthenticated: authState.isAuthenticated,
        principal: authState.principal,
        timestamp: Date.now()
      };

      localStorage.setItem('equirk_auth_state', JSON.stringify(stateToStore));
    } catch (error) {
      console.warn('Failed to store auth state:', error);
    }
  }

  /**
   * Retrieve authentication state from localStorage
   * @returns {Object|null} Stored authentication state or null
   */
  static getStoredAuthState() {
    try {
      const stored = localStorage.getItem('equirk_auth_state');
      if (!stored) return null;

      const authState = JSON.parse(stored);

      // Check if stored state is not too old (max 1 hour)
      const maxAge = 60 * 60 * 1000; // 1 hour
      if (Date.now() - authState.timestamp > maxAge) {
        localStorage.removeItem('equirk_auth_state');
        return null;
      }

      return authState;
    } catch (error) {
      console.warn('Failed to retrieve stored auth state:', error);
      return null;
    }
  }

  /**
   * Clear stored authentication state
   */
  static clearStoredAuthState() {
    try {
      localStorage.removeItem('equirk_auth_state');
    } catch (error) {
      console.warn('Failed to clear stored auth state:', error);
    }
  }
}

export default AuthUtils;