import { RequestHandler } from "express";
import { WhereOptions } from "sequelize";
import User from "../../db/models/user.model";

export const getOneUser: RequestHandler = async (req, res) => {
  try {
    let { email } = req.body;

    let filter = {} as WhereOptions;
    if (email) {
      filter = { ...filter, email };
    }

    const user = await User.findOne({
      where: filter,
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500);
  }
};
