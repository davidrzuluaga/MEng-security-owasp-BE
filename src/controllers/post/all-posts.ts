import { RequestHandler } from "express";
import { Post } from "../../db/models";
import { Op, WhereOptions } from "sequelize";
import SecurityManager from "../../modules/security";

export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    let filters: WhereOptions = {
      deletedAt: null,
    };
    if (req.query.title && typeof req.query.title === "string") {
      filters = {
        ...filters,
        title: {
          [Op.iLike]: `%${SecurityManager.sanitizeInput(req.query.title)}%`,
        },
      };
    }
    const posts = await Post.findAll({
      where: filters,
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: "comments",
          where: { deletedAt: null },
          required: false,
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    return res.status(200).json({ posts, success: !0 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};
