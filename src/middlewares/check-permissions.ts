import { Request, Response, NextFunction } from "express";
import SecurityManager from "../modules/security";
import { UserType } from "../types/user";

interface AuthenticatedRequest extends Request {
  user?: UserType;
}

const checkPermissions = (requiredRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user; // Assume req.user has been set by a previous authenticateToken middleware

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No user information found." });
    }

    const hasAccess = SecurityManager.hasAccess(user.role, requiredRoles);
    if (!hasAccess) {
      return res
        .status(403)
        .json({
          message: "Forbidden. You do not have the required permissions.",
        });
    }

    next(); // User has access, proceed to the next middleware or route handler
  };
};

export default checkPermissions;
