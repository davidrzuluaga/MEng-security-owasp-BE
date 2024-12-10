import { RequestHandler } from "express";
import Post from "../../db/models/posts.model";
import { AuthenticatedRequest } from "../../middlewares/check-permissions";

export const editPost: RequestHandler = async (
  req: AuthenticatedRequest,
  res
) => {
  try {
    const { id } = req.params; // Assuming the post ID is provided as a URL parameter
    const { title, post } = req.body; // Updated fields provided in the request body

    // Find the post to edit
    const existingPost = await Post.findByPk(id);

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the authenticated user is the same as the one deleting the post
    if (Number(existingPost.user_id) !== req?.user?.id) {
      return res.status(401).json({
        message: "Forbidden: You are not allowed to delete this post",
      });
    }

    // Update the post
    existingPost.title = title ?? existingPost.title;
    existingPost.post = post ?? existingPost.post;

    // Save the updated post
    const updatedPost = await existingPost.save();

    return res.status(200).json({ updatedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating the post" });
  }
};
