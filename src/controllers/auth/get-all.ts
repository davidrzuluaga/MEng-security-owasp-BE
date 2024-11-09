import { RequestHandler } from 'express';
import Sequelize, { Op, WhereOptions } from 'sequelize';

import { UserType } from '../../types/user';
import User from '../../db/models/user.model';

export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    let { keyword, client_id } = req.body;

    let filter = {} as WhereOptions & UserType;
    if (keyword) {
      filter = {
        ...filter,
        [Op.or]: [
          Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('name')), {
            [Op.iLike]: `%${keyword}%`,
          }),
          Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('email')), {
            [Op.iLike]: `%${keyword}%`,
          }),
        ],
      };
    }

    if (client_id) filter.client_id = client_id;

    const users = await User.findAll({
      where: filter,
    });
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500);
  }
};
