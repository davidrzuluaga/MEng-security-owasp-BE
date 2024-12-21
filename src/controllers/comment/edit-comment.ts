import { RequestHandler } from "express";
import Comment from "../../db/models/comments.model";
import SecurityManager from "../../modules/security";

export const editComment: RequestHandler = async (req, res) => {
  try {
    const { author_name, content } = req.body; // Assuming these come from middleware
    const { id } = req.params; // Comment ID

    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment?.author_name !== author_name) {
      return res.status(404).json({ message: "No author provided" });
    }

    // Sanitize the input content and update
    const sanitizedContent = SecurityManager.sanitizeInput(content);
    comment.content = sanitizedContent;

    const updatedComment = await comment.save();
    return res.status(200).json({ comment: updatedComment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error editing comment", error });
  }
};
