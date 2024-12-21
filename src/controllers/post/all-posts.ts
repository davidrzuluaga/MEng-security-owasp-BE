import { RequestHandler } from "express";
import { Post } from "../../db/models";

export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { deletedAt: null },
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
    return res.status(500).json({ message: "error"});
  }
};
