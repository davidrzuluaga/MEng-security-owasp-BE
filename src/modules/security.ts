import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserType } from "../types/user";

interface TokenPayload extends UserType {
  iat: number;
  exp: number;
}

class SecurityManager {
  private static readonly saltRounds = 10; // Number of salt rounds for hashing
  private static readonly secretKey =
    process.env.secretJWTKey || "DefaultSecretKey";
  private static readonly mfaSecretKey =
    process.env.mfaSecretKey || "MFASecretKey";

  /**
   * Encrypts a password using bcrypt.
   * @param password - The plain text password.
   * @returns A promise that resolves to the hashed password.
   */
  static encryptPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(
        password,
        bcrypt.genSaltSync(this.saltRounds),
        null,
        (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        }
      );
    });
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param plainPassword - The plain text password.
   * @param hashedPassword - The hashed password.
   * @returns A promise that resolves to a boolean indicating if the passwords match.
   */
  static comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
        if (err) {
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  }

  /**
   * Generates a JWT for a user.
   * @param userInfo - The user information to encode in the token.
   * @param expiresIn - Token expiration time in seconds (default: 1 day).
   * @returns The generated JWT.
   */
  static generateToken(userInfo: UserType, expiresIn = 86400): string {
    return jwt.sign(userInfo, this.secretKey, { expiresIn });
  }

  /**
   * Verifies a JWT and decodes its payload.
   * @param token - The JWT to verify.
   * @returns The decoded token payload.
   * @throws Error if the token is invalid or expired.
   */
  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.secretKey) as TokenPayload;
  }

  /**
   * Checks if a user has a required role.
   * @param userRole - The role of the user.
   * @param requiredRoles - An array of roles that are allowed access.
   * @returns A boolean indicating if the user has access.
   */
  static hasAccess(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
  }

  /**
   * Generates a Multi-Factor Authentication (MFA) token.
   * @param userId - The user ID for generating the MFA token.
   * @returns A one-time MFA token.
   */
  static generateMFAToken(userId: string): string {
    const hmac = crypto.createHmac("sha256", this.mfaSecretKey);
    hmac.update(userId + Date.now());
    return hmac.digest("hex").slice(0, 6); // 6-digit OTP
  }

  /**
   * Validates a provided MFA token.
   * @param userId - The user ID used to generate the token.
   * @param token - The token to validate.
   * @returns A boolean indicating if the token is valid.
   */
  static validateMFAToken(userId: string, token: string): boolean {
    const expectedToken = this.generateMFAToken(userId);
    return expectedToken === token;
  }
  /**
   * Validates if the user has the required access rights.
   * @param userId The authenticated user's ID.
   * @param targetId The ID of the resource's owner (e.g., comment's author).
   * @param userRole The role of the authenticated user.
   * @param requiredRoles Roles that are allowed to access the resource.
   * @returns True if the user has access, otherwise false.
   */

  static checkAccessRights(
    userId: number,
    targetId: number,
    userRole: string,
    requiredRoles: string[] = []
  ): boolean {
    // Allow access if the user is the owner of the resource
    if (userId === targetId) {
      return true;
    }

    // Allow access if the user's role matches any of the required roles
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // Deny access by default
    return false;
  }

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
