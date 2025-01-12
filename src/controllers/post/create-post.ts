import { RequestHandler } from "express";
import Post from "../../db/models/posts.model";
import { PostType } from "../../types/post";
import SecurityManager from "../../modules/security";

export const createPost: RequestHandler = async (req, res) => {
  try {
    const { title, post, author_name } = req.body;

    if (!title || !post || !author_name) {
      return res.status(400).json({ message: "Title and post are required" });
    }

    let newPost = {
      title: SecurityManager.sanitizeInput(title),
      post: SecurityManager.sanitizeInput(post),
      author_name: SecurityManager.sanitizeInput(author_name),
    } as PostType;

    if (author_name) {
      newPost = await Post.create(newPost);
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
