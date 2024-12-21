import { RequestHandler } from "express";
import Post from "../../db/models/posts.model";

export const deletePost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { author_name } = req.body;

    // Find the post to edit
    const existingPost = await Post.findByPk(id);

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost?.author_name !== author_name) {
      return res.status(404).json({ message: "No author provided" });
    }

    // Update the post
    existingPost.deletedAt = new Date();

    // Save the updated post
    const updatedPost = await existingPost.save();

    return res.status(200).json({ updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};
