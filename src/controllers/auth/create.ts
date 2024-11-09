import { RequestHandler } from 'express';
import User from '../../db/models/user.model';

export const createUser: RequestHandler = (req, res) => {
  try {
    const { email, password, name, role, client_id } = req.body;

    if (!email || !password || !name || !role || !client_id) {
      return res.status(400).send({
        message: 'Please pass email, name, role and password.',
        body: req.body,
      });
    }
    User.create({
      email,
      password,
      role,
      name,
      client_id,
      deleted: false,
    })
      .then((user) => res.status(201).send(user))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};
