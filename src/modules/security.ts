class SecurityManager {
  /**
   * Sanitizes input to prevent SQL injection, XSS, and other malicious attacks.
   * @param input The string to sanitize.
   * @returns A sanitized string.
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== "string") return input; // If input is not a string, return it as is.

    // Replace potentially dangerous characters with safe equivalents
    return input
      .replace(/<script.*?>.*?<\/script>/gi, "") // Remove <script> tags
      .replace(/<[^>]+>/g, "") // Remove other HTML tags
      .replace(/['";]/g, "") // Remove single quotes, double quotes, and semicolons
      .replace(/--/g, "") // Remove SQL comment indicators
      .replace(/\\/g, ""); // Remove backslashes
  }
}

export default SecurityManager;
