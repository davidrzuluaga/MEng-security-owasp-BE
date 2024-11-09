import { RequestHandler } from "express";
import Post from "../../db/models/posts.model";

export const createPost: RequestHandler = async (req, res) => {
  try {
    const { title, post, user_id } = req.body;
   
    const client = await Post.create({
      title, post, user_id 
    });

    if (client) {
      return res.status(201).json({ client });
    } else {
      return res.status(400).json({ client });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error", error });
  }
};
