import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt-nodejs';

import User from '../../db/models/user.model';
import { UserType } from '../../types/user';

const restrictUserInfo = (user: UserType): UserType => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  client_id: user.client_id,
});

export const signIn: RequestHandler = (req, res) => {
  const secretJWTKey = process.env.secretJWTKey || 'PrevKey';
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Please pass email and password.' });
    }
    let token: string;
    User.findOne({
      where: {
        email: req.body.email,
        deleted: { [Op.not]: true },
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            message: 'Authentication failed. User not found.',
          });
        }
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (isMatch && !err) {
            token = jwt.sign(restrictUserInfo(JSON.parse(JSON.stringify(user))), secretJWTKey, {
              expiresIn: 86400 * 20,
            });
            res.json({ success: true, token: 'JWT ' + token });
          } else {
            return res.status(400).send({
              message: 'Authentication failed. Wrong password.',
            });
          }
        });
      })
      .catch((error) => res.status(400).send(error));
  } catch (error) {
    return res.status(500);
  }
};
