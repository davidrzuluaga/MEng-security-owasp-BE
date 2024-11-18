import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import User from '../../db/models/user.model';
import SecurityManager from '../../modules/security';
import { UserType } from '../../types/user';

const restrictUserInfo = (user: UserType): UserType => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const signIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please pass email and password.' });
    }

    // Find the user in the database
    const user = await User.findOne({
      where: {
        email,
        deleted: { [Op.not]: true }, // Ensure user is not marked as deleted
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Authentication failed.' });
    }

    // Verify the password using SecurityManager
    const isMatch = await SecurityManager.comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Authentication failed.' });
    }

    // Restrict user information and generate a JWT
    const userInfo = restrictUserInfo(user as UserType);
    const token = SecurityManager.generateToken(userInfo, 86400 * 20); // Token valid for 20 days

    return res.json({ success: true, token: 'JWT ' + token });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
