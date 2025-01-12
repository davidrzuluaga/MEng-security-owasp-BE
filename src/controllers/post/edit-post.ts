import { RequestHandler } from "express";
import Post from "../../db/models/posts.model";
import SecurityManager from "../../modules/security";

export const editPost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the post ID is provided as a URL parameter
    const { title, post, author_name } = req.body; // Updated fields provided in the request body

    // Find the post to edit
    const existingPost = await Post.findByPk(id);

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post
    if (title) existingPost.title = SecurityManager.sanitizeInput(title);
    if (post) existingPost.post = SecurityManager.sanitizeInput(post);
    if (author_name)
      existingPost.author_name = SecurityManager.sanitizeInput(author_name);

    // Save the updated post
    const updatedPost = await existingPost.save();

    return res.status(200).json({ updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating the post" });
  }
};
