import { RequestHandler } from "express";
import Post from "../../db/models/posts.model";
import { AuthenticatedRequest } from "../../middlewares/check-permissions";
import { PostType } from "../../types/post";

export const createPost: RequestHandler = async (req: AuthenticatedRequest, res) => {
  try {
    const { title, post } = req.body;
   
    if (!title || !post) {
      return res.status(400).json({ message: "Title and post are required" });
    }

    let newPost = {} as PostType;
    if (req?.user?.id) {
      newPost = await Post.create({
        title, post, user_id: req.user.id
      });
    }

    if (newPost?.id) {
      return res.status(201).json({ newPost });
    } else {
      return res.status(400).json({ newPost });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};
