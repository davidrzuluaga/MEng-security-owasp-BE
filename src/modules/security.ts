class SecurityManager {
  /**
   * Sanitizes input to prevent SQL injection, XSS, and other malicious attacks.
   * @param input The string to sanitize.
   * @returns A sanitized string.
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== "string") return input;

    // Remove all HTML tags
    let sanitized = input.replace(/<[^>]*>/g, "");

    // Encode special HTML characters to prevent XSS
    sanitized = sanitized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");

    // Remove common SQL injection characters and keywords
    sanitized = sanitized
      .replace(/['"`;\\]/g, "") // Remove quotes, semicolons, backslashes
      .replace(/--/g, "") // Remove SQL comment indicators
      .replace(/\b(OR|AND|SELECT|INSERT|DELETE|UPDATE|DROP|UNION|WHERE|FROM|INTO|VALUES)\b/gi, "");

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, " ").trim();

    // Optionally, limit input length
    sanitized = sanitized.substring(0, 255);

    return sanitized;
  }
}

export default SecurityManager;
