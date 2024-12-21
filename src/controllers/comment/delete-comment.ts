import { RequestHandler } from "express";
import Comment from "../../db/models/comments.model";

export const deleteComment: RequestHandler = async (req, res) => {
  try {
    const { author_name } = req.body; // Assuming these come from middleware
    const { id } = req.params; // Comment ID
    
    const comment = await Comment.findByPk(id);

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment?.author_name !== author_name) {
      return res.status(404).json({ message: "No author provided" });
    }

    comment.deletedAt = new Date();

    // Delete the comment
    await comment.save();
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting comment", error });
  }
};
