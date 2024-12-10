import { RequestHandler } from "express";
import User from "../../db/models/user.model";
import SecurityManager from "../../modules/security";

export const createUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        message: "Please pass email, name, role, password, an",
        body: req.body,
      });
    }

    // Hash the password
    const hashedPassword = await SecurityManager.encryptPassword(password);

    // Create the user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      name,
      deleted: false,
    });

    // Respond with the created user (without sensitive info)
    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
    });
  }
};
