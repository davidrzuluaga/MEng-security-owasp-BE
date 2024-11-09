import { RequestHandler } from "express";
import Post from "../../db/models/posts.model";

export const getAllPosts: RequestHandler = async (req, res) => {
  try {
    const clients = await Post.findAll();

    return res.status(200).json({ clients, success: !0 });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error", error });
  }
};
